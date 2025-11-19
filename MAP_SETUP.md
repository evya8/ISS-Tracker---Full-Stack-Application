# 🗺️ Map Feature - Setup Instructions

## What Was Added

✅ **Backend**: New endpoint `/api/iss/history-hours` for fetching 5 hours of ISS positions
✅ **Frontend**: New `ISSMap.js` component with Leaflet.js
✅ **Integration**: Map added to App.js above existing panels

---

## Installation Steps (CRITICAL - DO THESE NOW)

### Step 1: Install Leaflet Packages

Open a terminal in the **frontend** folder and run:

```bash
cd frontend
npm install leaflet react-leaflet
```

**Wait for installation to complete** (should take 30-60 seconds)

---

### Step 2: Restart Backend (if running)

If your backend is already running, restart it to load the new endpoint:

1. Stop the backend (Ctrl+C in terminal)
2. Restart: `python app.py`
3. You should see the new endpoint listed:
   ```
   GET  /api/iss/history-hours   - ISS history by hours (for map)
   ```

---

### Step 3: Restart Frontend (if running)

If your frontend is already running, restart it:

1. Stop frontend (Ctrl+C in terminal)
2. Restart: `npm start`
3. Browser should open automatically

---

## What You'll See

After restarting, you should see:

```
┌─────────────────────────────────────────┐
│  Header (ISS Tracker)                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  🗺️ WORLD MAP (NEW!)                    │
│  - Shows ISS current position (red dot) │
│  - Shows 5-hour path (blue line)        │
│  - Auto-centers on ISS                  │
│  - Updates every 10 seconds             │
└─────────────────────────────────────────┘
┌──────────────────┬──────────────────────┐
│ ISS Location     │  Astronauts          │
└──────────────────┴──────────────────────┘
```

---

## Map Features

✅ **Interactive**: Click and drag to pan, scroll to zoom
✅ **Live tracking**: ISS marker updates every 10 seconds
✅ **Path visualization**: Blue line shows last 5 hours of trajectory
✅ **Auto-centering**: Map automatically follows ISS
✅ **Popup info**: Click marker to see exact coordinates
✅ **Legend**: Shows what colors mean

---

## Troubleshooting

### Issue: "Cannot find module 'leaflet'"
**Solution**: Run `npm install leaflet react-leaflet` in frontend folder

### Issue: Map doesn't appear
**Solution**: 
1. Check browser console (F12) for errors
2. Make sure packages installed successfully
3. Clear browser cache and refresh

### Issue: "Failed to load map data"
**Solution**: Backend might not be running or endpoint not available
1. Check backend is running on port 5001
2. Visit: http://localhost:5001/api/iss/history-hours?hours=5
3. Should see JSON with position data

### Issue: Map shows but no marker or path
**Solution**: Backend needs time to collect data
1. Wait 2-3 minutes for backend to collect positions
2. Refresh browser
3. Check backend terminal for "📍 ISS Location" messages

### Issue: Marker icon not showing correctly
**Solution**: This is fixed in the code (icon import), but if issue persists:
- Clear browser cache
- Make sure `node_modules/leaflet/dist/images/` exists

---

## Testing Checklist

After installation:

- [ ] Frontend runs without errors
- [ ] Map displays with world view
- [ ] Red marker appears at ISS location
- [ ] Blue line shows trajectory
- [ ] Map auto-centers as ISS moves
- [ ] Clicking marker shows popup
- [ ] Legend shows at bottom
- [ ] Position count updates
- [ ] No console errors

---

## Technical Details

### Packages Installed:
- **leaflet** (1.9.4): Core mapping library
- **react-leaflet** (4.2.1): React wrapper for Leaflet

### New Backend Endpoint:
```
GET /api/iss/history-hours?hours=5
```
Returns up to 300 position records (5 hours × 60 minutes)

### Map Specifications:
- **Tile Provider**: OpenStreetMap (free, no API key)
- **Default Zoom**: Level 3 (global view)
- **Update Frequency**: 10 seconds
- **Path Color**: Blue (#0066ff)
- **Marker Color**: Red (default Leaflet marker)
- **Auto-center**: Enabled (follows ISS)

---

## What's Next (Optional Enhancements)

If you have time, you could add:
- Dark mode map theme
- Custom ISS icon
- Distance/speed calculations
- Altitude indicator
- Country names on hover
- Screenshot/export functionality

---

**Installation complete! Follow the steps above to see your new map feature!** 🗺️
