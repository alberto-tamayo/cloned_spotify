import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setAlbums, onSearch }) => {
  const [artist, setArtist] = useState('');
  const navigate = useNavigate();

  const clientId = '67beae129b984e44865838e743c59c11';
  const clientSecret = '519c08415d064d31b478769b62090e04';

  const getToken = async () => {
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
  };

  const searchAlbums = async (artistName, token) => {
    const result = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=album`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await result.json();
    return data.albums.items;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (artist) {
      onSearch(true); // Notify App.js that a search is active
      const token = await getToken();
      const albums = await searchAlbums(artist, token);
      setAlbums(albums);
      navigate('/albums');
    }
  };

  const clearInput = () => {
    setArtist('');
    onSearch(false); // Reset the search state
    setAlbums([]); // Clear the albums state
    navigate('/'); // Navigate back to the home page
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container" onClick={() => onSearch(false)}>
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
          alt="Spotify Logo"
          className="spotify-logo"
        />
      </Link>
      <div className="navbar-center">
        <Link to="/" className="nav-home" onClick={() => onSearch(false)}>
          <FiHome className="home-icon" />
        </Link>
        <div className="search-form-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="What do you want to play?"
              className="search-input"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
            {artist && (
              <span className="material-icons clear-icon" onClick={clearInput}>
                close
              </span>
            )}
          </form>
        </div>
      </div>
      <div className="navbar-texts">
        <span className="premium-text">Explore Premium</span>
        <span className="install-text">Install App</span>
      </div>
    </nav>
  );
};
//Put your css below

export default Navbar;
