import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertBanner from './components/AlertBanner';
import ISSLocation from './components/ISSLocation';
import AstronautList from './components/AstronautList';
import ISSMap from './components/ISSMap';
import './App.css';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [issPosition, setIssPosition] = useState(null);
  const [astronauts, setAstronauts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch ISS current position
      const positionResponse = await axios.get(`${API_BASE_URL}/iss/current`);
      setIssPosition(positionResponse.data);
      
      // Fetch astronauts
      const astronautsResponse = await axios.get(`${API_BASE_URL}/astronauts`);
      setAstronauts(astronautsResponse.data);
      
      // Fetch alerts
      const alertsResponse = await axios.get(`${API_BASE_URL}/alerts`);
      setAlerts(alertsResponse.data);
      
      // Fetch history
      const historyResponse = await axios.get(`${API_BASE_URL}/iss/history?limit=20`);
      setHistory(historyResponse.data);
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from server. Is the backend running?');
    }
  };

  // Dismiss an alert
  const dismissAlert = async (alertId) => {
    try {
      await axios.post(`${API_BASE_URL}/alerts/dismiss`, { alert_id: alertId });
      // Refresh alerts
      const alertsResponse = await axios.get(`${API_BASE_URL}/alerts`);
      setAlerts(alertsResponse.data);
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Poll every 10 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="App">
      <header style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px' }}>
          🛰️ International Space Station Tracker
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
          Real-time ISS location and astronaut tracking with country detection
        </p>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ef9a9a'
          }}>
            ⚠️ {error}
          </div>
        )}

        <AlertBanner alerts={alerts} onDismiss={dismissAlert} />

        {/* World Map with ISS tracking */}
        <ISSMap />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <ISSLocation position={issPosition} history={history} />
          <AstronautList astronauts={astronauts} alerts={alerts} />
        </div>

        <footer style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '14px',
          borderTop: '1px solid #e0e0e0',
          marginTop: '40px'
        }}>
          <p>
            Data refreshes every 10 seconds | 
            {lastUpdate && ` Last updated: ${lastUpdate.toLocaleTimeString()}`}
          </p>
          <p style={{ marginTop: '10px' }}>
            Data provided by <a href="http://open-notify.org/" target="_blank" rel="noopener noreferrer">Open Notify API</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
