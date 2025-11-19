# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIs                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │ Open Notify ISS API  │  │ Open Notify Astros API   │   │
│  │ (ISS Location)       │  │ (Astronauts in Space)    │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Python/Flask)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  data_fetcher.py (Background Thread)               │    │
│  │  - Fetches ISS location every 60 sec               │    │
│  │  - Fetches astronaut data every 60 sec             │    │
│  │  - Checks correlations                             │    │
│  │  - Creates alerts when conditions met              │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  database.py (SQLite Operations)                   │    │
│  │  - save_iss_position()                             │    │
│  │  - save_astronauts()                               │    │
│  │  - create_alert()                                  │    │
│  │  - get_* queries                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │         SQLite Database (iss_tracker.db)           │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │ countries  | iss_positions | astronauts     │ │    │
│  │  │ alerts                                       │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  app.py (Flask REST API)                          │    │
│  │  - GET /api/iss/current                           │    │
│  │  - GET /api/iss/history                           │    │
│  │  - GET /api/astronauts                            │    │
│  │  - GET /api/alerts                                │    │
│  │  - POST /api/alerts/dismiss                       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP (CORS enabled)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  App.js (Main Component)                           │    │
│  │  - useEffect: Polls backend every 10 sec          │    │
│  │  - useState: Manages app state                    │    │
│  │  - axios: Makes HTTP requests                     │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│          ┌───────────────┼───────────────┐                 │
│          ▼               ▼               ▼                 │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐        │
│  │AlertBanner  │ │ISSLocation  │ │AstronautList │        │
│  │.js          │ │.js          │ │.js           │        │
│  │- Shows red  │ │- Shows ISS  │ │- Shows table │        │
│  │  alerts     │ │  coords     │ │  of people   │        │
│  │- Dismiss btn│ │- History    │ │- Highlights  │        │
│  └─────────────┘ └─────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### 1. Initial Setup (One Time)
```
1. Backend starts
2. database.py creates tables
3. Populates countries table
4. Starts background thread for data collection
5. Flask API starts listening
```

### 2. Data Collection Loop (Every 60 seconds)
```
1. data_fetcher.fetch_iss_location()
   └─> HTTP GET to Open Notify ISS API
   └─> Returns: {latitude, longitude}
   └─> database.save_iss_position()

2. data_fetcher.fetch_astronauts()
   └─> HTTP GET to Open Notify Astros API
   └─> Returns: [{name, craft}, ...]
   └─> Map names to nationalities
   └─> database.save_astronauts()

3. data_fetcher.check_correlations()
   └─> Get current ISS position
   └─> Get all countries from DB
   └─> Get current astronauts from DB
   └─> For each country:
       ├─> Check if ISS is within bounds
       ├─> Check if astronaut nationality matches
       └─> If BOTH true: database.create_alert()
```

### 3. Frontend Polling (Every 10 seconds)
```
1. App.js useEffect triggers
2. Four parallel API calls to backend:
   ├─> GET /api/iss/current
   ├─> GET /api/astronauts
   ├─> GET /api/alerts
   └─> GET /api/iss/history
3. Update React state with responses
4. Components re-render with new data
```

## Correlation Logic Detail

```python
# Pseudocode for correlation detection

iss_lat, iss_lon = get_current_iss_position()
countries = get_all_countries()
astronauts = get_current_astronauts()

for country in countries:
    # Check if ISS is within country boundaries
    if (country.min_lat <= iss_lat <= country.max_lat AND
        country.min_lon <= iss_lon <= country.max_lon):
        
        # ISS is over this country!
        for astronaut in astronauts:
            # Check if astronaut is from this country
            if astronaut.nationality == country.name:
                # CORRELATION FOUND!
                create_alert(
                    country=country.name,
                    astronaut=astronaut.name,
                    message=f"ISS is over {country.name}! {astronaut.name} is onboard!"
                )
```

## Technology Stack Details

### Backend Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Web Framework | Flask 3.0 | REST API server |
| Database | SQLite | Data persistence |
| HTTP Client | Requests | External API calls |
| Threading | Python threading | Background tasks |
| CORS | Flask-CORS | Allow frontend access |

### Frontend Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| UI Framework | React 18 | Component-based UI |
| HTTP Client | Axios | Backend API calls |
| State Management | React Hooks | Local state |
| Styling | CSS | Component styling |

## Port Configuration

```
Backend:  http://localhost:5001
Frontend: http://localhost:3000

CORS allows frontend (port 3000) to call backend (port 5001)
```

## Database Schema Details

### countries
```sql
id | name    | min_lat | max_lat | min_lon | max_lon
---|---------|---------|---------|---------|--------
1  | USA     | 24.5    | 49.4    | -125.0  | -66.9
2  | Russia  | 41.0    | 82.0    | 19.0    | 180.0
...
```

### iss_positions
```sql
id | timestamp           | latitude | longitude
---|---------------------|----------|----------
1  | 2024-01-01 10:00:00 | 42.5     | -71.2
2  | 2024-01-01 10:01:00 | 42.6     | -71.0
...
```

### astronauts
```sql
id | timestamp           | name            | nationality | craft
---|---------------------|-----------------|-------------|------
1  | 2024-01-01 10:00:00 | Jasmin Moghbeli | USA         | ISS
2  | 2024-01-01 10:00:00 | Oleg Kononenko  | Russia      | ISS
...
```

### alerts
```sql
id | timestamp           | country_name | astronaut_name  | message             | is_active
---|---------------------|--------------|-----------------|---------------------|----------
1  | 2024-01-01 10:05:00 | USA          | Jasmin Moghbeli | ISS is over USA!... | 1
...
```

## Key Design Decisions

1. **Why SQLite?**
   - No separate DB server needed
   - Perfect for simple projects
   - File-based storage

2. **Why 60-second backend polling?**
   - ISS moves ~7.66 km/s
   - Balance between freshness and API limits
   - Open Notify has no strict limits

3. **Why 10-second frontend polling?**
   - Near real-time updates
   - Not too frequent to cause lag
   - Backend has fresh data every 60 sec

4. **Why clear old astronauts on each fetch?**
   - Astronaut roster changes infrequently
   - Always want current crew only
   - Prevents duplicate entries

5. **Why clear alerts before creating new ones?**
   - Prevents duplicate alerts
   - Only show currently active correlations
   - User can still see them before they're cleared

## Extensibility Ideas

- Add more countries
- Add map visualization
- Add email/SMS notifications
- Add prediction (when ISS will be over specific country)
- Add historical analysis (how often ISS passes over each country)
- Support multiple space stations
- Add astronaut photos/bios
- Add ISS camera feeds

---

This architecture provides a solid foundation for understanding and extending the application! 🚀
