import React from 'react';

function AlertBanner({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {alerts.map(alert => (
        <div key={alert.id} style={{
          marginBottom: alerts.length > 1 ? '15px' : '0'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            🚀 Alert!
          </h2>
          <p style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
            {alert.message}
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Detected at: {new Date(alert.timestamp).toLocaleString()}
          </p>
          <button
            onClick={() => onDismiss(alert.id)}
            style={{
              backgroundColor: 'white',
              color: '#ff4444',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}

export default AlertBanner;
