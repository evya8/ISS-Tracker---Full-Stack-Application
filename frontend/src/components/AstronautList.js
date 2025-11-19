import React from 'react';

function AstronautList({ astronauts, alerts }) {
  if (!astronauts || astronauts.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0 }}>👨‍🚀 Astronauts in Space</h2>
        <p>Loading astronaut data...</p>
      </div>
    );
  }

  // Get list of astronaut names that are in alerts
  const alertedAstronauts = alerts.map(alert => alert.astronaut_name);

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px'
    }}>
      <h2 style={{ marginTop: 0 }}>
        👨‍🚀 Astronauts in Space ({astronauts.length})
      </h2>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                Name
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                Nationality
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                Craft
              </th>
            </tr>
          </thead>
          <tbody>
            {astronauts.map((astronaut, index) => {
              const isAlerted = alertedAstronauts.includes(astronaut.name);
              
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor: isAlerted ? '#fff3cd' : 'white',
                    borderBottom: index < astronauts.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    {isAlerted && '⭐ '}
                    {astronaut.name}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {astronaut.nationality || 'Unknown'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {astronaut.craft}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic'
      }}>
        ⭐ = Astronaut's home country is currently below the ISS
      </div>
    </div>
  );
}

export default AstronautList;
