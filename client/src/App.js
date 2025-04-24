import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {

    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(apiUrl)
      .then((res) => res.text())
      .then((text) => setMessage(text))
      .catch(() => setMessage('API call failed.'));
  }, []);

  return (
    <div>
      <h1>Frontend is running ✅</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
