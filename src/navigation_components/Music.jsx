import React, { useEffect, useState } from 'react';
import './Music.css';

const clientId = '67beae129b984e44865838e743c59c11';
const clientSecret = '519c08415d064d31b478769b62090e04';

const Music = ({ setCurrentTrack, setIsPlaying }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get a token
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

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = await getToken();
        const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPlaylists(data.playlists.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = async (playlistId) => {
    try {
      const token = await getToken();
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const playableTrack = data.items.find(item => item.track && item.track.preview_url);
      if (playableTrack) {
        setCurrentTrack(playableTrack.track);
        setIsPlaying(true);
      } else {
        alert('No playable tracks found.');
      }
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (playlists.length === 0) {
    return <div>No playlists available</div>;
  }

  return (
    <div className="music-container">
      <h2 className="section-title">Featured Playlists</h2>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
            <img src={playlist.images[0]?.url} alt={playlist.name} className="playlist-image" />
            <h3 className="playlist-title">{playlist.name}</h3>
            <p className="playlist-description">{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
