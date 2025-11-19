import sqlite3
from datetime import datetime

DB_NAME = 'iss_tracker.db'

def get_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


def init_database():
    """Initialize database with all tables"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create countries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS countries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            min_lat REAL NOT NULL,
            max_lat REAL NOT NULL,
            min_lon REAL NOT NULL,
            max_lon REAL NOT NULL
        )
    ''')
    
    # Create iss_positions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS iss_positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        )
    ''')
    
    # Create astronauts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS astronauts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            nationality TEXT,
            craft TEXT
        )
    ''')
    
    # Create alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            country_name TEXT NOT NULL,
            astronaut_name TEXT NOT NULL,
            message TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")


def populate_countries():
    """Insert country boundary data"""
    conn = get_connection()
    cursor = conn.cursor()
    
    countries_data = [
        ('USA', 24.5, 49.4, -125.0, -66.9),
        ('Russia', 41.0, 82.0, 19.0, 180.0),
        ('China', 18.0, 54.0, 73.0, 135.0),
        ('Japan', 24.0, 46.0, 122.0, 146.0),
        ('India', 8.0, 37.0, 68.0, 97.0),
        ('Canada', 41.7, 83.1, -141.0, -52.6),
        ('Germany', 47.3, 55.1, 5.9, 15.0),
        ('France', 41.3, 51.1, -5.1, 9.6),
        ('Italy', 36.6, 47.1, 6.6, 18.5),
        ('United Kingdom', 49.9, 60.8, -8.6, 1.8),
    ]
    
    for country in countries_data:
        try:
            cursor.execute('''
                INSERT INTO countries (name, min_lat, max_lat, min_lon, max_lon)
                VALUES (?, ?, ?, ?, ?)
            ''', country)
        except sqlite3.IntegrityError:
            # Country already exists, skip
            pass
    
    conn.commit()
    conn.close()
    print("✅ Countries data populated")


def save_iss_position(latitude, longitude):
    """Save ISS position to database"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO iss_positions (latitude, longitude)
        VALUES (?, ?)
    ''', (latitude, longitude))
    
    conn.commit()
    conn.close()


def save_astronauts(astronauts_list):
    """Save astronauts data to database
    astronauts_list: [{"name": str, "nationality": str, "craft": str}, ...]
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    # Clear old astronaut data (we want current crew only)
    cursor.execute('DELETE FROM astronauts')
    
    for astronaut in astronauts_list:
        cursor.execute('''
            INSERT INTO astronauts (name, nationality, craft)
            VALUES (?, ?, ?)
        ''', (astronaut['name'], astronaut['nationality'], astronaut['craft']))
    
    conn.commit()
    conn.close()


def create_alert(country_name, astronaut_name, message):
    """Create a new alert"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if similar alert already exists and is active
    cursor.execute('''
        SELECT id FROM alerts 
        WHERE country_name = ? AND astronaut_name = ? AND is_active = 1
    ''', (country_name, astronaut_name))
    
    if cursor.fetchone() is None:
        # No active alert exists, create new one
        cursor.execute('''
            INSERT INTO alerts (country_name, astronaut_name, message)
            VALUES (?, ?, ?)
        ''', (country_name, astronaut_name, message))
        conn.commit()
        print(f"🚨 Alert created: {message}")
    
    conn.close()


def get_latest_iss_position():
    """Get the most recent ISS position"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT latitude, longitude, timestamp
        FROM iss_positions
        ORDER BY timestamp DESC
        LIMIT 1
    ''')
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'latitude': row['latitude'],
            'longitude': row['longitude'],
            'timestamp': row['timestamp']
        }
    return None


def get_current_astronauts():
    """Get current astronauts in space"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT name, nationality, craft, timestamp
        FROM astronauts
        ORDER BY name
    ''')
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def get_active_alerts():
    """Get all active alerts"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, country_name, astronaut_name, message, timestamp
        FROM alerts
        WHERE is_active = 1
        ORDER BY timestamp DESC
    ''')
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def dismiss_alert(alert_id):
    """Mark an alert as inactive"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE alerts
        SET is_active = 0
        WHERE id = ?
    ''', (alert_id,))
    
    conn.commit()
    conn.close()


def get_iss_history(limit=20):
    """Get last N ISS positions"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT latitude, longitude, timestamp
        FROM iss_positions
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def get_all_countries():
    """Get all countries with their boundaries"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT name, min_lat, max_lat, min_lon, max_lon
        FROM countries
    ''')
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def clear_all_alerts():
    """Mark all alerts as inactive (useful for testing)"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE alerts SET is_active = 0')
    
    conn.commit()
    conn.close()


# Initialize database when module is imported
if __name__ == '__main__':
    init_database()
    populate_countries()
    print("Database setup complete!")
