# 🚀 Quick Start Guide

## Step-by-Step Instructions

### Terminal 1 - Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
python app.py
```

**Expected output:**
```
✅ Database initialized
✅ Countries data loaded
✅ Background data collection started
✅ Flask API running on http://localhost:5001
```

**Keep this terminal running!**

---

### Terminal 2 - Frontend

Open a NEW terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start React app
npm start
```

**Expected output:**
- Browser will automatically open at http://localhost:3000
- You should see the ISS Tracker dashboard

---

## What You Should See

### After 1-2 minutes:

✅ **ISS Location panel**: Shows current latitude/longitude
✅ **Astronauts panel**: Lists people currently in space  
✅ **Position history**: Last 20 ISS locations

### When alert triggers:

🚨 **Red banner appears** when ISS passes over a country that has an astronaut onboard!

Example: "🚀 ISS is over United States! Astronaut Jasmin Moghbeli (USA) is onboard the ISS right now!"

---

## Quick Commands

### Test if APIs work:
```bash
cd backend
python data_fetcher.py
```

### Check database:
```bash
cd backend
sqlite3 iss_tracker.db
.tables
SELECT COUNT(*) FROM iss_positions;
.quit
```

### Stop everything:
- Press `Ctrl+C` in both terminal windows

---

## Troubleshooting

**Problem**: Backend shows errors
- **Solution**: Make sure Python 3 is installed: `python --version`

**Problem**: Frontend won't connect
- **Solution**: Make sure backend is running first!

**Problem**: No alerts appearing
- **Solution**: Wait 5-10 minutes. ISS needs to pass over a country with matching astronaut.

---

## Testing Tips

Want to see an alert quickly?

1. Open `backend/data_fetcher.py`
2. Find the `NATIONALITY_MAP` dictionary
3. Temporarily add the current astronauts' countries
4. Restart backend
5. Wait for next data collection cycle (60 seconds)

---

**That's it! You're now tracking the ISS in real-time! 🛰️**
