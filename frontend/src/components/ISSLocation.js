import React from 'react';

function ISSLocation({ position, history }) {
  if (!position) {
    return (
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>📍 ISS Location</h2>
        <p>Loading ISS position...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2 style={{ marginTop: 0 }}>📍 Current ISS Location</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
            Latitude
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            {position.latitude.toFixed(4)}°
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
            Longitude
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            {position.longitude.toFixed(4)}°
          </div>
        </div>
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginTop: '10px'
      }}>
        Last updated: {new Date(position.timestamp).toLocaleString()}
      </div>

      {history && history.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
            Recent Positions ({history.length} records)
          </h3>
          <div style={{
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            {history.slice(0, 10).map((pos, index) => (
              <div key={index} style={{
                padding: '5px 0',
                borderBottom: index < 9 ? '1px solid #eee' : 'none'
              }}>
                {new Date(pos.timestamp).toLocaleTimeString()}: 
                Lat {pos.latitude.toFixed(2)}°, Lon {pos.longitude.toFixed(2)}°
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ISSLocation;
