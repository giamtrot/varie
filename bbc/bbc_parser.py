import requests
import json
from bs4 import BeautifulSoup
import os
from datetime import datetime
import sys
import argparse

# --- Argument Parsing ---
parser = argparse.ArgumentParser(description="BBC News-in-English-Fetcher Parser")
parser.add_argument(
    '--data-dir',
    type=str,
    help="Directory to store and access data files (e.g., bbc_programs.json)."
)
parser.add_argument('max_pages', nargs='?', default=-1, help="Max pages to parse.")
parser.add_argument('stop_on_existing', nargs='?', default='true', help="Stop on existing program.")

def resource_path(filename, data_dir=None):
    """
    Resolve a path for runtime resources.
    """
    if data_dir:
        return os.path.join(data_dir, filename)

    exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'executable', None) else os.path.abspath(os.path.dirname(__file__))

    candidates = []
    if hasattr(sys, '_MEIPASS'):
        candidates.append(os.path.join(sys._MEIPASS, filename))
    if exe_dir:
        candidates.append(os.path.join(exe_dir, filename))
    candidates.append(os.path.join(os.path.abspath(os.path.dirname(__file__)), filename))
    candidates.append(os.path.join(os.getcwd(), filename))

    for path in candidates:
        try:
            if os.path.exists(path):
                return path
        except Exception:
            pass

    return os.path.join(exe_dir or os.path.abspath(os.path.dirname(__file__)), filename)

def parse_full_content_page(full_content_url):
    if not full_content_url or full_content_url == 'N/A':
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    try:
        response = requests.get(full_content_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        yield f"Error fetching full content page {full_content_url}: {e}"
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    soup = BeautifulSoup(response.text, 'html.parser')
    main_content = soup.find('div', class_='widget-richtext')
    if not main_content:
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    story, headlines, keywords = [], [], []

    story_heading = main_content.find('h3', string='The story')
    if story_heading:
        for sibling in story_heading.find_next_siblings():
            if sibling.name == 'h3': break
            if sibling.name == 'p': story.append(str(sibling))

    headlines_heading = main_content.find('h3', string='News headlines')
    if headlines_heading:
        next_element = headlines_heading.find_next_sibling()
        while next_element:
            if next_element.name == 'p' and 'Key words and phrases' in next_element.get_text(): break
            if next_element.name == 'p' and next_element.get_text(strip=True):
                br_tag = next_element.find('br')
                if br_tag:
                    headline_parts_html, source_parts_html, after_br = [], [], False
                    for content in next_element.contents:
                        if content == br_tag:
                            after_br = True
                            continue
                        (source_parts_html if after_br else headline_parts_html).append(str(content).strip())
                    
                    headline_html = " ".join(filter(None, headline_parts_html))
                    source_html = " ".join(filter(None, source_parts_html))

                    if headline_html and source_html: headlines.append(f"{headline_html}\n  {source_html}")
                    elif headline_html: headlines.append(headline_html)
                    elif source_html: headlines.append(source_html)
                else:
                    headlines.append(str(next_element))
            next_element = next_element.find_next_sibling()

    keywords_heading = main_content.find('strong', string='Key words and phrases')
    if keywords_heading and keywords_heading.parent.name == 'p':
        current_element = keywords_heading.parent.find_next_sibling()
        while current_element:
            if current_element.name == 'h3': break
            if current_element.name == 'p':
                temp_p_soup = BeautifulSoup(str(current_element), 'html.parser')
                keyword_html, definition_html = '', ''
                keyword_strong = temp_p_soup.find('strong')
                if keyword_strong:
                    keyword_html = str(keyword_strong)
                    keyword_strong.decompose()
                if br_tag := temp_p_soup.find('br'): br_tag.decompose()
                definition_html = temp_p_soup.p.encode_contents().decode().strip()
                if keyword_html:
                    keywords.append(f"\t{keyword_html}")
                    if definition_html: keywords.append(f"\t\t{definition_html}")
            elif current_element.name == 'ul':
                for li in current_element.find_all('li'):
                    if example_html := str(li): keywords.append(f"\t\t{example_html}")
            current_element = current_element.find_next_sibling()

    return {
        'story': ' '.join(story) if story else 'N/A',
        'headlines': '\n'.join(headlines) if headlines else 'N/A',
        'keywords': '\n'.join(keywords) if keywords else 'N/A'
    }

def get_full_content_link(program_url):
    try:
        response = requests.get(program_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        yield f"Error fetching program page {program_url}: {e}"
        return 'N/A'

    soup = BeautifulSoup(response.text, 'html.parser')
    if next_data_script := soup.find('script', id='__NEXT_DATA__'):
        if next_data_script.string:
            try:
                data = json.loads(next_data_script.string)
                page_props = data.get('props', {}).get('pageProps', {})
                for _, value in page_props.get('page', {}).items():
                    if isinstance(value, dict) and 'contents' in value:
                        for content in value.get('contents', []):
                            if content.get('type') == 'audio-episode':
                                for block in content.get('model', {}).get('blocks', []):
                                    if block.get('type') == 'mediaMetadata':
                                        if "https://" in (long_synopsis := block.get('model', {}).get('synopses', {}).get('long', '')):
                                            for word in long_synopsis.split():
                                                if word.startswith("https://"):
                                                    return word.strip()
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                yield f"Error parsing JSON on program page {program_url}: {e}"
    return 'N/A'

def parse_bbc_audio_page(url, page_number=1, stop_on_existing=False, existing_links=None):
    paginated_url = f"{url}?page={page_number}"
    try:
        response = requests.get(paginated_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        yield f"Error fetching the URL {paginated_url}: {e}"
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    programs = []
    cont = 1
    if next_data_script := soup.find('script', id='__NEXT_DATA__'):
        if next_data_script.string:
            try:
                data = json.loads(next_data_script.string)
                page_obj = data.get('props', {}).get('pageProps', {}).get('page', {})
                page_data_key = next((key for key in page_obj if 'p05hw4bq' in key), None)
                if page_data_key:
                    for item in page_obj.get(page_data_key, {}).get('contents', []):
                        if item.get('type') == 'audio-episode':
                            model = item.get('model', {})
                            title, path = model.get('title'), model.get('path')
                            date = 'N/A'
                            if release_date_timestamp := model.get('releaseDate'):
                                try:
                                    date = datetime.fromtimestamp(release_date_timestamp / 1000).strftime('%d %B %Y')
                                except (ValueError, TypeError) as e:
                                    yield f"Could not parse date timestamp {release_date_timestamp}: {e}"
                            
                            program_link = f"https://www.bbc.com{path}"
                            if stop_on_existing and existing_links and program_link in existing_links:
                                yield f"Existing program found ({date} - {title} - {program_link}). Stopping."
                                for p in programs: yield p
                                return

                            description = 'N/A'
                            for block in model.get('blocks', []):
                                if block.get('type') == 'mediaMetadata':
                                    description = block.get('model', {}).get('synopses', {}).get('short', 'N/A')
                                    break
                            
                            if title and path:
                                yield f"\tParsing article {cont} - {date} - {title}"
                                cont += 1
                                full_content_link = yield from get_full_content_link(program_link)
                                full_content_details = yield from parse_full_content_page(full_content_link)
                                
                                programs.append({
                                    'title': title, 'description': description, 'date': date,
                                    'link': program_link, 'full_content_link': full_content_link,
                                    'story': full_content_details.get('story'),
                                    'headlines': full_content_details.get('headlines'),
                                    'keywords': full_content_details.get('keywords')
                                })
            except (json.JSONDecodeError, KeyError) as e:
                yield f"Error parsing JSON from __NEXT_DATA__: {e}"
            except Exception as e:
                yield f"An unexpected error occurred: {e}"

    for p in programs: yield p

def load_programs(filename):
    if not os.path.exists(filename): return {}
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return {p['link']: p for p in json.load(f)}
    except (json.JSONDecodeError, IOError) as e:
        print(f"Could not read or parse {filename}: {e}")
        return {}

def save_programs(filename, programs):
    try:
        with open(filename, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(programs, f, indent=4, ensure_ascii=False)
    except IOError as e:
        print(f"Could not write to {filename}: {e}")

def run_parser(max_pages=-1, stop_on_existing=True, data_dir=None):
    base_url = "https://www.bbc.com/audio/brand/p05hw4bq"
    DATA_FILE = resource_path("bbc_programs.json", data_dir)
    yield f"Using data file: {DATA_FILE}"

    yield "==============="
    if max_pages == -1:
        yield "Parsing all pages..."
        max_pages = float('inf')
    else:
        yield f"Parsing {max_pages} page(s)..."
    
    if stop_on_existing:
        yield "Will stop when an already-loaded program is found."
    else:
        yield "Will process all pages regardless of existing programs."
    yield "==============="

    yield "Loading existing programs..."
    existing_programs_map = load_programs(DATA_FILE)
    existing_links = set(existing_programs_map.keys())
    yield f"Found {len(existing_links)} existing programs."
    
    all_programs = list(existing_programs_map.values()) if existing_programs_map else []
    yield "==============="

    current_page = 1
    new_programs_found = False
    while current_page <= max_pages:
        yield f"Fetching page {current_page}..."
        page_had_new = False
        programs_on_page_generator = parse_bbc_audio_page(base_url, page_number=current_page, stop_on_existing=stop_on_existing, existing_links=existing_links)
        
        stop_parsing = False
        for program_or_message in programs_on_page_generator:
            if isinstance(program_or_message, str):
                yield program_or_message
                if "Stopping." in program_or_message:
                    stop_parsing = True
            elif isinstance(program_or_message, dict):
                if program_or_message['link'] not in existing_links:
                    all_programs.append(program_or_message)
                    existing_links.add(program_or_message['link'])
                    page_had_new = True
                    new_programs_found = True
        
        if not page_had_new and stop_on_existing:
            yield f"No new programs found on page {current_page}. Stopping."
            break

        if stop_parsing:
            break
            
        current_page += 1

    if new_programs_found:
        def parse_date_key(p):
            try: return datetime.strptime(p.get('date', ''), '%d %B %Y')
            except (ValueError, TypeError): return datetime.min
        
        programs_to_save = sorted(all_programs, key=parse_date_key, reverse=True)
        
        yield f"\nSaving {len(programs_to_save)} programs to {DATA_FILE}..."
        save_programs(DATA_FILE, programs_to_save)
        yield "Save complete."
    else:
        yield "\nNo new programs found."

if __name__ == "__main__":
    args, _ = parser.parse_known_args()
    
    try:
        run_max_pages = int(args.max_pages)
    except ValueError:
        run_max_pages = 1
        
    run_stop_on_existing = str(args.stop_on_existing).lower() in ('true', '1', 'yes')

    for message in run_parser(max_pages=run_max_pages, stop_on_existing=run_stop_on_existing, data_dir=args.data_dir):
        print(message)