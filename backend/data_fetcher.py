import requests
import time
from database import (
    save_iss_position, save_astronauts, create_alert,
    get_all_countries, clear_all_alerts
)

# API URLs
ISS_LOCATION_API = "http://api.open-notify.org/iss-now.json"
ASTRONAUTS_API = "http://api.open-notify.org/astros.json"

# Nationality mapping (based on common astronaut names)
# In a real app, you'd use a more comprehensive database
NATIONALITY_MAP = {
    # Current ISS crew (as of late 2024 - update as needed)
    "Jasmin Moghbeli": "USA",
    "Andreas Mogensen": "Denmark",
    "Satoshi Furukawa": "Japan",
    "Konstantin Borisov": "Russia",
    "Oleg Kononenko": "Russia",
    "Nikolai Chub": "Russia",
    "Loral O'Hara": "USA",
    "Matthew Dominick": "USA",
    "Michael Barratt": "USA",
    "Jeanette Epps": "USA",
    "Alexander Grebenkin": "Russia",
    "Tracy C. Dyson": "USA",
    "Mike Fincke": "USA",
    "Butch Wilmore": "USA",
    "Suni Williams": "USA",
    "Don Pettit": "USA",
    "Nick Hague": "USA",
    "Aleksandr Gorbunov": "Russia",
}


def fetch_iss_location():
    """
    Fetch current ISS location from API
    Returns: {"latitude": float, "longitude": float} or None on error
    """
    try:
        response = requests.get(ISS_LOCATION_API, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        position = data.get('iss_position', {})
        latitude = float(position.get('latitude'))
        longitude = float(position.get('longitude'))
        
        print(f"📍 ISS Location: Lat {latitude:.2f}, Lon {longitude:.2f}")
        return {"latitude": latitude, "longitude": longitude}
    
    except Exception as e:
        print(f"❌ Error fetching ISS location: {e}")
        return None


def fetch_astronauts():
    """
    Fetch current astronauts in space
    Returns: [{"name": str, "craft": str, "nationality": str}, ...] or None on error
    """
    try:
        response = requests.get(ASTRONAUTS_API, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        astronauts = []
        for person in data.get('people', []):
            name = person.get('name')
            craft = person.get('craft')
            
            # Determine nationality from our mapping
            nationality = NATIONALITY_MAP.get(name, "Unknown")
            
            astronauts.append({
                "name": name,
                "craft": craft,
                "nationality": nationality
            })
        
        print(f"👨‍🚀 Found {len(astronauts)} astronauts in space")
        return astronauts
    
    except Exception as e:
        print(f"❌ Error fetching astronauts: {e}")
        return None


def is_iss_over_country(iss_lat, iss_lon, country):
    """
    Check if ISS coordinates are within country boundaries
    """
    return (
        country['min_lat'] <= iss_lat <= country['max_lat'] and
        country['min_lon'] <= iss_lon <= country['max_lon']
    )


def check_correlations(iss_position, astronauts):
    """
    Check if ISS is over a country AND an astronaut from that country is onboard
    Creates alerts when correlation is found
    """
    if not iss_position or not astronauts:
        return
    
    iss_lat = iss_position['latitude']
    iss_lon = iss_position['longitude']
    
    # Get all countries from database
    countries = get_all_countries()
    
    # Clear old alerts before checking new ones
    clear_all_alerts()
    
    # Check each country
    for country in countries:
        if is_iss_over_country(iss_lat, iss_lon, country):
            print(f"🌍 ISS is currently over {country['name']}")
            
            # Check if any astronaut is from this country
            for astronaut in astronauts:
                # Normalize country names for matching
                astronaut_country = astronaut['nationality']
                
                # Handle common variations
                if astronaut_country == "USA" and country['name'] == "USA":
                    match = True
                elif astronaut_country == country['name']:
                    match = True
                else:
                    match = False
                
                if match:
                    message = f"🚀 ISS is over {country['name']}! Astronaut {astronaut['name']} is onboard the {astronaut['craft']} right now!"
                    create_alert(country['name'], astronaut['name'], message)


def run_data_collection():
    """
    Main loop: fetch data, save to DB, check correlations
    Runs continuously with 60-second intervals
    """
    print("🚀 Starting ISS Tracker data collection...")
    
    while True:
        try:
            print("\n" + "="*50)
            print(f"⏰ Data collection cycle - {time.strftime('%Y-%m-%d %H:%M:%S')}")
            print("="*50)
            
            # 1. Fetch and save ISS location
            iss_position = fetch_iss_location()
            if iss_position:
                save_iss_position(iss_position['latitude'], iss_position['longitude'])
            
            # 2. Fetch and save astronauts
            astronauts = fetch_astronauts()
            if astronauts:
                save_astronauts(astronauts)
            
            # 3. Check for correlations (ISS over country + astronaut match)
            check_correlations(iss_position, astronauts)
            
            print(f"\n✅ Cycle complete. Sleeping for 60 seconds...")
            time.sleep(60)
        
        except KeyboardInterrupt:
            print("\n🛑 Data collection stopped by user")
            break
        except Exception as e:
            print(f"❌ Error in data collection: {e}")
            time.sleep(60)


if __name__ == '__main__':
    # Test the functions
    print("Testing API connections...\n")
    
    iss_pos = fetch_iss_location()
    astronauts = fetch_astronauts()
    
    if iss_pos and astronauts:
        print("\n✅ All APIs working correctly!")
        print(f"ISS Position: {iss_pos}")
        print(f"Astronauts: {len(astronauts)} people in space")
    else:
        print("\n❌ Some APIs failed. Check your internet connection.")
