import React, { useEffect, useState } from 'react';
import './Podcasts.css'; 

const clientId = '67beae129b984e44865838e743c59c11';
const clientSecret = '519c08415d064d31b478769b62090e04';

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
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

    const fetchPodcasts = async () => {
      try {
        const token = await getToken();
        console.log('Token fetched:', token); 

        const response = await fetch('https://api.spotify.com/v1/search?q=podcast&type=show&market=US&limit=10', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('Fetched podcasts data:', data); // Debugging log

        if (data.shows && data.shows.items) {
          setPodcasts(data.shows.items);
        } else {
          console.error('Unexpected data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (podcasts.length === 0) {
    return <div>No podcasts available</div>;
  }

  return (
    <div className="podcasts-container">
      <h2 className="section-title">Podcasts</h2>
      <div className="podcasts-grid">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="podcast-card">
            <img src={podcast.images[0]?.url} alt={podcast.name} className="podcast-image" />
            <h3 className="podcast-title">{podcast.name}</h3>
            <p className="podcast-description">{podcast.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podcasts;
