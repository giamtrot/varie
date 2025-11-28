import requests
import json
from bs4 import BeautifulSoup
import os
from datetime import datetime

DATA_FILE = "bbc_programs.json"

def parse_full_content_page(full_content_url):
    """
    Fetches and parses the full content page to extract specific details.

    Args:
        full_content_url (str): The URL of the full content page.

    Returns:
        dict: A dictionary with 'story', 'headlines', and 'keywords'.
    """
    if not full_content_url or full_content_url == 'N/A':
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    try:
        response = requests.get(full_content_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching full content page {full_content_url}: {e}")
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the main content container
    main_content = soup.find('div', class_='widget-richtext')
    if not main_content:
        return {'story': 'N/A', 'headlines': 'N/A', 'keywords': 'N/A'}

    story = []
    headlines = []
    keywords = []

    # --- Story Extraction ---
    story_heading = main_content.find('h3', string='The story')
    if story_heading:
        for sibling in story_heading.find_next_siblings():
            if sibling.name == 'h3':  # Stop at the next heading
                break
            if sibling.name == 'p':
                story.append(str(sibling))

    # --- Headlines Extraction ---
    headlines_heading = main_content.find('h3', string='News headlines')
    if headlines_heading:
        next_element = headlines_heading.find_next_sibling()
        while next_element:
            if next_element.name == 'p' and 'Key words and phrases' in next_element.get_text():
                break

            if next_element.name == 'p' and next_element.get_text(strip=True):
                br_tag = next_element.find('br')
                if br_tag:
                    headline_parts_html = []
                    source_parts_html = []
                    after_br = False

                    for content in next_element.contents:
                        if content == br_tag:
                            after_br = True
                            continue
                        
                        if after_br:
                            source_parts_html.append(str(content).strip())
                        else:
                            headline_parts_html.append(str(content).strip())
                    
                    headline_html = " ".join(part for part in headline_parts_html if part)
                    source_html = " ".join(part for part in source_parts_html if part)

                    if headline_html and source_html:
                        headlines.append(f"{headline_html}\n  {source_html}")
                    elif headline_html:
                        headlines.append(headline_html)
                    elif source_html:
                        headlines.append(source_html) # Should not happen if headline_html is empty
                else:
                    headlines.append(str(next_element))

            next_element = next_element.find_next_sibling()

    # --- Keywords Extraction ---
    # Find the "Key words and phrases" heading
    keywords_heading = main_content.find('strong', string='Key words and phrases')
    
    current_keyword_output = []
    if keywords_heading and keywords_heading.parent.name == 'p':
        current_element = keywords_heading.parent.find_next_sibling()
        while current_element:
            if current_element.name == 'h3': # Stop at the next main heading
                break

            if current_element.name == 'p':
                # This is likely a keyword and its definition
                temp_p_soup = BeautifulSoup(str(current_element), 'html.parser')
                
                keyword_html = ''
                definition_html = ''

                # Find and extract the keyword (usually in <strong>)
                keyword_strong = temp_p_soup.find('strong')
                if keyword_strong:
                    keyword_html = str(keyword_strong)
                    keyword_strong.decompose() # Remove strong tag from temp_p_soup
                
                # Decompose the <br> tag if present
                br_tag = temp_p_soup.find('br')
                if br_tag:
                    br_tag.decompose()
                
                # The remaining HTML in temp_p_soup.p is the definition
                # Use .encode_contents().decode() to get inner HTML
                definition_html = temp_p_soup.p.encode_contents().decode().strip()

                if keyword_html:
                    current_keyword_output.append(f"\t{keyword_html}")
                    if definition_html:
                        current_keyword_output.append(f"\t\t{definition_html}")

            elif current_element.name == 'ul':
                # These are example sentences for the last keyword
                for li in current_element.find_all('li'):
                    example_html = str(li)
                    if example_html:
                        current_keyword_output.append(f"\t\t{example_html}")
            
            current_element = current_element.find_next_sibling()

    keywords.extend(current_keyword_output) # Add all formatted keyword strings to the main keywords list

    return {
        'story': ' '.join(story) if story else 'N/A',
        'headlines': '\n'.join(headlines) if headlines else 'N/A',
        'keywords': '\n'.join(keywords) if keywords else 'N/A'
    }

def get_full_content_link(program_url):
    """
    Fetches the individual program page and extracts the link to the full content.

    Args:
        program_url (str): The URL of the individual program page.

    Returns:
        str: The URL to the full content, or 'N/A' if not found.
    """
    try:
        response = requests.get(program_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching program page {program_url}: {e}")
        return 'N/A'

    soup = BeautifulSoup(response.text, 'html.parser')
    
    next_data_script = soup.find('script', id='__NEXT_DATA__')
    if next_data_script and next_data_script.string:
        try:
            data = json.loads(next_data_script.string)
            page_props = data.get('props', {}).get('pageProps', {})
            
            for key, value in page_props.get('page', {}).items():
                if isinstance(value, dict) and 'contents' in value:
                    for content in value.get('contents', []):
                        if content.get('type') == 'audio-episode':
                            for block in content.get('model', {}).get('blocks', []):
                                if block.get('type') == 'mediaMetadata':
                                    synopses = block.get('model', {}).get('synopses', {})
                                    long_synopsis = synopses.get('long', '')
                                    if "https://" in long_synopsis:
                                        for word in long_synopsis.split():
                                            if word.startswith("https://"):
                                                return word.strip()
        except (json.JSONDecodeError, KeyError, IndexError) as e:
            print(f"Error parsing JSON on program page {program_url}: {e}")

    return 'N/A'


def parse_bbc_audio_page(url, page_number=1):
    """
    Fetches the content of a BBC Audio brand page for a specific page number and parses it.

    Args:
        url (str): The base URL of the BBC Audio brand page.
        page_number (int): The page number to fetch.

    Returns:
        list: A list of dictionaries, where each dictionary represents a program/episode.
    """
    paginated_url = f"{url}?page={page_number}"
    try:
        response = requests.get(paginated_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL {paginated_url}: {e}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    
    programs = []

    next_data_script = soup.find('script', id='__NEXT_DATA__')
    if next_data_script and next_data_script.string:
        try:
            data = json.loads(next_data_script.string)
            page_obj = data.get('props', {}).get('pageProps', {}).get('page', {})
            
            page_data_key = next((key for key in page_obj if 'p05hw4bq' in key), None)
            
            if page_data_key:
                page_data_specific = page_obj.get(page_data_key, {})
                contents = page_data_specific.get('contents', [])
                
                for item in contents:
                    if item.get('type') == 'audio-episode':
                        model = item.get('model', {})
                        title = model.get('title')
                        path = model.get('path')
                        description = 'N/A'
                        date = 'N/A'
                        
                        release_date_timestamp = model.get('releaseDate')
                        if release_date_timestamp:
                            try:
                                # Convert timestamp from milliseconds to seconds
                                date_obj = datetime.fromtimestamp(release_date_timestamp / 1000)
                                date = date_obj.strftime('%d %B %Y')
                            except (ValueError, TypeError) as e:
                                print(f"Could not parse date timestamp {release_date_timestamp}: {e}")
                        
                        program_link = f"https://www.bbc.com{path}"

                        for block in model.get('blocks', []):
                            if block.get('type') == 'mediaMetadata':
                                synopses = block.get('model', {}).get('synopses', {})
                                description = synopses.get('short', 'N/A')
                                break
                        
                        if title and path:
                            full_content_link = get_full_content_link(program_link)
                            full_content_details = parse_full_content_page(full_content_link)
                            
                            programs.append({
                                'title': title,
                                'description': description,
                                'date': date,
                                'link': program_link,
                                'full_content_link': full_content_link,
                                'story': full_content_details.get('story'),
                                'headlines': full_content_details.get('headlines'),
                                'keywords': full_content_details.get('keywords')
                            })
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error parsing JSON from __NEXT_DATA__: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while parsing JSON data: {e}")

    return programs

def load_programs(filename):
    """Loads programs from a JSON file."""
    if not os.path.exists(filename):
        return {}
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            programs_list = json.load(f)
            return {p['link']: p for p in programs_list}
    except (json.JSONDecodeError, IOError) as e:
        print(f"Could not read or parse {filename}: {e}")
        return {}

def save_programs(filename, programs):
    """Saves programs to a JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(programs, f, indent=4, ensure_ascii=False)
    except IOError as e:
        print(f"Could not write to {filename}: {e}")

if __name__ == "__main__":
    base_url = "https://www.bbc.com/audio/brand/p05hw4bq"
    current_page = 1
    all_programs = []

    print("Loading existing programs...")
    existing_programs_map = load_programs(DATA_FILE)
    existing_links = set(existing_programs_map.keys())
    print(f"Found {len(existing_links)} existing programs.")

    while current_page <= 3: # Loop for page 1, 2, and 3
        print(f"Fetching page {current_page}...")
        programs_on_page = parse_bbc_audio_page(base_url, page_number=current_page)

        if not programs_on_page:
            print(f"No programs found on page {current_page}. Stopping.")
            break
        
        all_programs.extend(programs_on_page)
        current_page += 1

    if all_programs:
        new_programs = [p for p in all_programs if p['link'] not in existing_links]
        
        if new_programs:
            print(f"\nFound {len(new_programs)} new programs:")
            for i, program in enumerate(new_programs):
                print(f"\n--- New Program {i+1} ---")
                print(f"  Title: {program.get('title', 'N/A')}")
                print(f"  Description: {program.get('description', 'N/A')}")
                print(f"  Date: {program.get('date', 'N/A')}")
                print(f"  Link: {program.get('link', 'N/A')}")
                print(f"  Full Content Link: {program.get('full_content_link', 'N/A')}")
                print(f"  Story: {program.get('story', 'N/A')}")
                print(f"  Headlines: {program.get('headlines', 'N/A')}")
                print(f"  Keywords: {program.get('keywords', 'N/A')}")
        else:
            print("\nNo new programs found.")

        # Update and save all programs
        scraped_programs_map = {p['link']: p for p in all_programs}
        existing_programs_map.update(scraped_programs_map)
        
        print(f"\nSaving {len(existing_programs_map)} programs to {DATA_FILE}...")
        save_programs(DATA_FILE, list(existing_programs_map.values()))
        print("Save complete.")

    else:
        print("Failed to parse the BBC Audio page.")
