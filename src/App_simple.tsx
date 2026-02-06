import React from 'react';

export default function App() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4f46e5',
      color: 'white',
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      flexDirection: 'column' as const,
      gap: '20px'
    }}>
      <h1>✅ ContractShield is Running!</h1>
      <p style={{ fontSize: '18px' }}>App is live on localhost:5174</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'white',
          color: '#4f46e5',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Click Me
      </button>
    </div>
  );
}
