import requests
import json
from bs4 import BeautifulSoup

def parse_bbc_audio_page(url):
    """
    Fetches the content of a BBC Audio brand page and parses it to extract program details.

    Args:
        url (str): The URL of the BBC Audio brand page.

    Returns:
        list: A list of dictionaries, where each dictionary represents a program/episode
              with details like title, description, and link, or None if an error occurs.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    programs = []

    # Try to find the __NEXT_DATA__ script tag which contains structured JSON data
    next_data_script = soup.find('script', id='__NEXT_DATA__')
    if next_data_script and next_data_script.string:
        try:
            data = json.loads(next_data_script.string)
            page_obj = data.get('props', {}).get('pageProps', {}).get('page', {})
            
            # Directly access the contents using the identified key
            page_data_specific = page_obj.get('@"audio","brand","p05hw4bq",', {})
            contents = page_data_specific.get('contents', [])


            for item in contents:
                if item.get('type') == 'audio-episode':
                    model = item.get('model', {})
                    title = model.get('title')
                    path = model.get('path')
                    description = 'N/A'
                    # Extract short synopsis from blocks if available
                    for block in model.get('blocks', []):
                        if block.get('type') == 'mediaMetadata':
                            synopses = block.get('model', {}).get('synopses', {})
                            description = synopses.get('short', 'N/A')
                            break
                    
                    if title and path:
                        programs.append({
                            'title': title,
                            'description': description,
                            'link': f"https://www.bbc.com{path}"
                        })
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from __NEXT_DATA__: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while parsing JSON data: {e}")
    
    # If no programs were found through JSON, or if there was an error,
    # the function will return an empty list or whatever was populated
    return programs

    return programs

if __name__ == "__main__":
    page_url = "https://www.bbc.com/audio/brand/p05hw4bq"
    parsed_data = parse_bbc_audio_page(page_url)

    if parsed_data:
        if parsed_data:
            print(f"Found {len(parsed_data)} programs:")
            for program in parsed_data:
                print(f"  Title: {program.get('title', 'N/A')}")
                print(f"  Description: {program.get('description', 'N/A')}")
                print(f"  Link: {program.get('link', 'N/A')}")
                print("-" * 30)
        else:
            print("No program details found on the page.")
    else:
        print("Failed to parse the BBC Audio page.")
