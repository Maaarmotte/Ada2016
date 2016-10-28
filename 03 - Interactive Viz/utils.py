import re
import json
import requests

def trim_university_name(full_name):
    match = re.match('^(.+?)(?: - .+)?$', full_name)
    if match is None:
        return None
    else:
        return match.group(1)

def get_api_key():
    with open('google_api_key.json') as f:
        json_data = json.load(f)
        return json_data['api_key']

def search_place(place_name):
    BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    
    api_key = get_api_key()
    parameters = {'key': api_key, 'query': place_name}
    
    r = requests.get(BASE_URL, params=parameters)
    response = r.json()

    if response['status'] != 'OK':
        return None
    else:
        result = response['results'][0]
        location = result['geometry']['location']
        place_id = result['place_id']
        
        return (place_id, location['lat'], location['lng'])

def search_canton(place_id):
    BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
    
    api_key = get_api_key()
    parameters = {'key': api_key, 'place_id': place_id}
    
    r = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=parameters)
    response = r.json()
    
    if response['status'] != 'OK':
        return None
    else:
        result = response['results'][0]
        
        for component in result['address_components']:
            if 'administrative_area_level_1' in component['types']:
                return component['short_name']
            
        return None

def search_uni(university_name):
    place = search_place(university_name)
    if place is None:
        return None
    else:
        place_id, lat, lng = place
        canton = search_canton(place_id)
        return (canton, lat, lng)

from IPython.display import HTML, display
def display_map():
    iframe = HTML('''
    <div style="position:relative;width:100%;height:0;padding-bottom:60%;">
    <iframe src="leaflet.html" style="position:absolute;width:100%;height:100%;left:0;top:0;"></iframe></div>
    ''')
    display(iframe)

