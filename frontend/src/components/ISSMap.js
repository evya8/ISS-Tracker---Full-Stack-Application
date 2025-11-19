import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Custom ISS Icon (using emoji/unicode for simplicity)
const issIcon = L.divIcon({
  className: 'iss-icon',
  html: `<div style="
    font-size: 32px;
    text-align: center;
    line-height: 32px;
    text-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(0,150,255,0.6);
  ">🛰️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Auto-center component to keep ISS in view
function AutoCenter({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
}

function ISSMap() {
  const [issPosition, setIssPosition] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ISS data
  const fetchData = async () => {
    try {
      setError(null);
      
      // Get current ISS position
      const currentResponse = await axios.get('http://localhost:5001/api/iss/current');
      const lat = currentResponse.data.latitude;
      const lon = currentResponse.data.longitude;
      setIssPosition([lat, lon]);
      
      // Get available history (try 5 hours, but use whatever is available)
      const historyResponse = await axios.get('http://localhost:5001/api/iss/history-hours?hours=5');
      
      // Convert to coordinate pairs [lat, lon] and filter valid coordinates
      const path = historyResponse.data
        .filter(pos => {
          // Filter out invalid coordinates
          return pos.latitude != null && 
                 pos.longitude != null && 
                 Math.abs(pos.latitude) <= 90 && 
                 Math.abs(pos.longitude) <= 180;
        })
        .map(pos => [pos.latitude, pos.longitude])
        .reverse(); // Reverse so oldest position is first in line
      
      setPathHistory(path);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError('Failed to load map data');
      setLoading(false);
    }
  };

  // Fetch data on mount and every 10 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>🗺️ Loading World Map...</h2>
          <p>Fetching ISS location data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#ffebee',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ef9a9a'
      }}>
        <h2 style={{ marginTop: 0, color: '#c62828' }}>⚠️ Map Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!issPosition) {
    return (
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p>No ISS data available yet...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '15px' }}>
        🗺️ ISS World Map - Live Tracking
      </h2>
      
      <div style={{
        height: '400px',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '2px solid #ddd'
      }}>
        <MapContainer
          center={issPosition}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Auto-center on ISS */}
          <AutoCenter position={issPosition} />
          
          {/* ISS Path (only show if we have enough data points) */}
          {pathHistory.length >= 2 && (
            <Polyline
              positions={pathHistory}
              color="#0066ff"
              weight={3}
              opacity={0.7}
            />
          )}
          
          {/* ISS Current Position Marker with custom icon */}
          <Marker position={issPosition} icon={issIcon}>
            <Popup>
              <strong>🛰️ ISS Current Location</strong><br />
              <strong>Latitude:</strong> {issPosition[0].toFixed(4)}°<br />
              <strong>Longitude:</strong> {issPosition[1].toFixed(4)}°<br />
              <em>Updates every 10 seconds</em>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div style={{
        marginTop: '10px',
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛰️</span>
          <span>Current ISS Position</span>
        </div>
        {pathHistory.length >= 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px',
              height: '3px',
              backgroundColor: '#0066ff',
              opacity: 0.7
            }}></div>
            <span>Trajectory Path ({pathHistory.length} points)</span>
          </div>
        )}
        {pathHistory.length < 2 && (
          <div style={{ 
            color: '#ff9800',
            fontStyle: 'italic',
            fontSize: '13px'
          }}>
            ⏳ Collecting more data points... ({pathHistory.length} so far)
          </div>
        )}
        <div style={{ marginLeft: 'auto', fontStyle: 'italic' }}>
          {pathHistory.length >= 60 
            ? `${Math.floor(pathHistory.length / 60)} hour${pathHistory.length >= 120 ? 's' : ''} of data`
            : `${pathHistory.length} minutes of data`
          }
        </div>
      </div>
    </div>
  );
}

export default ISSMap;
