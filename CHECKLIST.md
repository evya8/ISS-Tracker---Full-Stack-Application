# ✅ Setup & Testing Checklist

## Pre-Flight Checklist

### Prerequisites
- [ ] Python 3.x installed (`python --version`)
- [ ] Node.js & npm installed (`node --version` && `npm --version`)
- [ ] Internet connection (for APIs)
- [ ] Two terminal windows ready

---

## Backend Setup Checklist

### Installation
- [ ] Navigate to `backend/` folder
- [ ] Run `pip install -r requirements.txt`
- [ ] No errors during installation

### First Run
- [ ] Run `python app.py`
- [ ] See: "✅ Database initialized"
- [ ] See: "✅ Countries data loaded"
- [ ] See: "✅ Background data collection started"
- [ ] See: "✅ Flask API running on http://localhost:5001"
- [ ] See: "📍 ISS Location: Lat X.XX, Lon Y.YY"
- [ ] See: "👨‍🚀 Found X astronauts in space"

### Verify Backend
- [ ] Open browser: http://localhost:5001/api/health
- [ ] Should see: `{"status": "healthy", ...}`
- [ ] Check: http://localhost:5001/api/iss/current
- [ ] Should see JSON with latitude/longitude
- [ ] Check: http://localhost:5001/api/astronauts
- [ ] Should see JSON array of astronauts

### Database Verification
- [ ] File `iss_tracker.db` created in backend folder
- [ ] (Optional) Run: `sqlite3 iss_tracker.db` then `.tables`
- [ ] Should see 4 tables: countries, iss_positions, astronauts, alerts

---

## Frontend Setup Checklist

### Installation
- [ ] Open NEW terminal window
- [ ] Navigate to `frontend/` folder
- [ ] Run `npm install`
- [ ] No errors during installation (warnings are OK)

### First Run
- [ ] Run `npm start`
- [ ] Browser automatically opens at http://localhost:3000
- [ ] See: ISS Tracker header
- [ ] See: ISS Location panel (might say "Loading..." initially)
- [ ] See: Astronauts panel (might say "Loading..." initially)

### Verify Frontend
- [ ] After 10-20 seconds, ISS Location shows latitude/longitude
- [ ] Astronauts table populates with names
- [ ] Position history shows recent coordinates
- [ ] "Last updated" timestamp in footer changes
- [ ] No red error messages

---

## Feature Testing Checklist

### Basic Features
- [ ] ISS coordinates update every 10 seconds
- [ ] Astronaut list appears with names
- [ ] Position history shows last positions
- [ ] Footer shows last update time

### Alert Feature (May Take Time)
- [ ] Wait 5-10 minutes for ISS to move
- [ ] Check backend terminal for: "🌍 ISS is currently over..."
- [ ] If over USA and US astronaut exists: "🚨 Alert created..."
- [ ] Red alert banner appears in frontend
- [ ] Click "Dismiss" button on alert
- [ ] Alert disappears from frontend

### Responsive Testing
- [ ] Resize browser window
- [ ] Layout adjusts on smaller screens
- [ ] All elements remain visible

---

## Common Issues Checklist

### Backend Issues
- [ ] Port 5001 not available?
  - [ ] Kill other processes: `lsof -ti:5001 | xargs kill -9`
- [ ] Import errors?
  - [ ] Reinstall: `pip install -r requirements.txt --force-reinstall`
- [ ] Database errors?
  - [ ] Delete `iss_tracker.db` and restart

### Frontend Issues
- [ ] Port 3000 not available?
  - [ ] Choose different port when prompted
- [ ] "Failed to fetch" errors?
  - [ ] Verify backend is running
  - [ ] Check backend URL in `src/App.js` is `http://localhost:5001`
- [ ] Blank screen?
  - [ ] Check browser console for errors (F12)
  - [ ] Clear cache and refresh

### API Issues
- [ ] No ISS data?
  - [ ] Test API directly: http://api.open-notify.org/iss-now.json
  - [ ] Check internet connection
- [ ] No astronaut data?
  - [ ] Test API directly: http://api.open-notify.org/astros.json

---

## Production Readiness Checklist

### Code Quality
- [ ] No console errors in backend
- [ ] No console errors in frontend
- [ ] All features working as expected

### Documentation
- [ ] README.md reviewed
- [ ] QUICKSTART.md understood
- [ ] ARCHITECTURE.md makes sense

### Testing
- [ ] Tested for at least 10 minutes
- [ ] Seen at least one alert (or understand why not)
- [ ] Tested dismiss alert functionality
- [ ] Verified data updates automatically

---

## Learning Verification Checklist

### Understanding Backend
- [ ] Understand what Flask does
- [ ] Understand what SQLite does
- [ ] Understand API fetching process
- [ ] Understand correlation logic

### Understanding Frontend
- [ ] Understand React components
- [ ] Understand state management
- [ ] Understand API polling
- [ ] Understand conditional rendering

### Understanding Full Stack
- [ ] Understand how backend and frontend communicate
- [ ] Understand data flow from APIs to UI
- [ ] Understand database role
- [ ] Understand alert triggering logic

---

## Next Steps

After completing this checklist:

1. **Experiment**: Try modifying code
   - Change update intervals
   - Add new countries
   - Customize styling

2. **Extend**: Add new features
   - Map visualization
   - More APIs
   - User preferences

3. **Deploy**: (Optional)
   - Research deployment options
   - Consider Heroku, Railway, or similar

---

## Final Verification

- [ ] Both backend and frontend running simultaneously
- [ ] Data updating automatically
- [ ] No critical errors in either terminal
- [ ] Application usable and functional

🎉 **If all checked: Congratulations! Your ISS Tracker is fully operational!** 🚀

---

## Support

If you encounter issues:

1. Check the troubleshooting sections in README.md
2. Review backend terminal logs
3. Check browser console (F12) for frontend errors
4. Verify API connectivity: http://api.open-notify.org/iss-now.json
5. Ensure both backend and frontend are running

Good luck and happy tracking! 🛰️
