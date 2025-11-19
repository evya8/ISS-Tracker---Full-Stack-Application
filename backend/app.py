from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import database
import data_fetcher

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend (port 3000)

# Initialize database on startup
database.init_database()
database.populate_countries()


# ==================== API ENDPOINTS ====================

@app.route('/api/iss/current', methods=['GET'])
def get_current_iss():
    """Get the most recent ISS position"""
    position = database.get_latest_iss_position()
    if position:
        return jsonify(position), 200
    else:
        return jsonify({"error": "No ISS data available yet"}), 404


@app.route('/api/iss/history', methods=['GET'])
def get_iss_history():
    """Get last 20 ISS positions"""
    limit = request.args.get('limit', default=20, type=int)
    history = database.get_iss_history(limit)
    return jsonify(history), 200


@app.route('/api/iss/history-hours', methods=['GET'])
def get_iss_history_hours():
    """Get ISS positions for last N hours (for map visualization)"""
    hours = request.args.get('hours', default=5, type=int)
    # Calculate limit: 60 positions per hour (one per minute)
    limit = hours * 60
    history = database.get_iss_history(limit)
    return jsonify(history), 200


@app.route('/api/astronauts', methods=['GET'])
def get_astronauts():
    """Get current astronauts in space"""
    astronauts = database.get_current_astronauts()
    return jsonify(astronauts), 200


@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all active alerts"""
    alerts = database.get_active_alerts()
    return jsonify(alerts), 200


@app.route('/api/alerts/dismiss', methods=['POST'])
def dismiss_alert():
    """Dismiss an alert by ID"""
    data = request.get_json()
    alert_id = data.get('alert_id')
    
    if not alert_id:
        return jsonify({"error": "alert_id is required"}), 400
    
    database.dismiss_alert(alert_id)
    return jsonify({"message": "Alert dismissed"}), 200


@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get all countries with their boundaries"""
    countries = database.get_all_countries()
    return jsonify(countries), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "ISS Tracker API is running"
    }), 200


# ==================== BACKGROUND DATA COLLECTION ====================

def start_data_collection():
    """Start data collection in background thread"""
    print("🚀 Starting background data collection thread...")
    data_fetcher.run_data_collection()


# ==================== MAIN ====================

if __name__ == '__main__':
    # Start data collection in a separate thread
    data_thread = threading.Thread(target=start_data_collection, daemon=True)
    data_thread.start()
    
    print("\n" + "="*60)
    print("🚀 ISS TRACKER API SERVER")
    print("="*60)
    print("✅ Database initialized")
    print("✅ Countries data loaded")
    print("✅ Background data collection started")
    print("✅ Flask API running on http://localhost:5001")
    print("\n📡 Available endpoints:")
    print("   GET  /api/health              - Health check")
    print("   GET  /api/iss/current         - Current ISS position")
    print("   GET  /api/iss/history         - ISS position history")
    print("   GET  /api/iss/history-hours   - ISS history by hours (for map)")
    print("   GET  /api/astronauts          - Current astronauts")
    print("   GET  /api/alerts              - Active alerts")
    print("   POST /api/alerts/dismiss      - Dismiss an alert")
    print("   GET  /api/countries           - All countries")
    print("="*60 + "\n")
    
    # Run Flask app
    app.run(debug=True, host='0.0.0.0', port=5001, use_reloader=False)
