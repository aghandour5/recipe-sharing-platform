import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://localhost:5000') // Our backend is running on port 5000
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Error fetching data:", err));
  }, []); // The empty array [] means this effect runs only once when the component mounts

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Sharing Platform</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;