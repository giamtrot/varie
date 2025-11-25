import requests
import json
from bs4 import BeautifulSoup

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
            
            # More robustly find the 'long' synopsis
            for key, value in page_props.get('page', {}).items():
                if isinstance(value, dict) and 'contents' in value:
                    for content in value.get('contents', []):
                        if content.get('type') == 'audio-episode':
                            for block in content.get('model', {}).get('blocks', []):
                                if block.get('type') == 'mediaMetadata':
                                    synopses = block.get('model', {}).get('synopses', {})
                                    long_synopsis = synopses.get('long', '')
            # Extract the URL from the long synopsis text
            if "https://" in long_synopsis:
                # Split the text and find the URL
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
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
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
                        
                        program_link = f"https://www.bbc.com{path}"

                        for block in model.get('blocks', []):
                            if block.get('type') == 'mediaMetadata':
                                synopses = block.get('model', {}).get('synopses', {})
                                description = synopses.get('short', 'N/A')
                                break
                        
                        if title and path:
                            full_content_link = get_full_content_link(program_link)
                            programs.append({
                                'title': title,
                                'description': description,
                                'link': program_link,
                                'full_content_link': full_content_link
                            })
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error parsing JSON from __NEXT_DATA__: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while parsing JSON data: {e}")

    return programs

if __name__ == "__main__":
    base_url = "https://www.bbc.com/audio/brand/p05hw4bq"
    current_page = 1
    all_programs = []

    while current_page <= 3: # Loop for page 1, 2, and 3
        print(f"Fetching page {current_page}...")
        programs_on_page = parse_bbc_audio_page(base_url, page_number=current_page)

        if not programs_on_page:
            print(f"No programs found on page {current_page}. Stopping.")
            break
        
        all_programs.extend(programs_on_page)
        current_page += 1

    if all_programs:
        print(f"\nFound a total of {len(all_programs)} programs:")
        for i, program in enumerate(all_programs):
            print(f"\n--- Program {i+1} ---")
            print(f"  Title: {program.get('title', 'N/A')}")
            print(f"  Description: {program.get('description', 'N/A')}")
            print(f"  Link: {program.get('link', 'N/A')}")
            print(f"  Full Content Link: {program.get('full_content_link', 'N/A')}")
    else:
        print("Failed to parse the BBC Audio page.")
