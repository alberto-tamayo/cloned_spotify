import React, { useEffect, useState } from 'react';
import './Audiobooks.css'; 

const clientId = '67beae129b984e44865838e743c59c11';
const clientSecret = '519c08415d064d31b478769b62090e04';

const Audiobooks = () => {
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
          },
          body: 'grant_type=client_credentials',
        });
        const data = await result.json();
        return data.access_token;
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const fetchAudiobooks = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=audiobook&type=album&market=US&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAudiobooks(data.albums.items);
      } catch (error) {
        console.error('Error fetching audiobooks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (audiobooks.length === 0) {
    return <div>No audiobooks available</div>;
  }

  return (
    <div className="audiobooks-container">
      <h2 className="section-title">Audiobooks</h2>
      <div className="audiobooks-grid">
        {audiobooks.map((audiobook) => (
          <div key={audiobook.id} className="audiobook-card">
            <img src={audiobook.images[0]?.url} alt={audiobook.name} className="audiobook-image" />
            <h3 className="audiobook-title">{audiobook.name}</h3>
            <p className="audiobook-description">{audiobook.artists[0]?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Audiobooks;
