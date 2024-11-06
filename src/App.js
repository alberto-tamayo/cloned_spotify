import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavigationTabs from './navigation_components/NavigationTabs';
import Music from './navigation_components/Music';
import Podcasts from './navigation_components/Podcasts';
import Audiobooks from './navigation_components/Audiobooks';
import StickyPlayer from './components/StickyPlayer';
import './App.css';

// Lazy load other components
const AlbumsList = lazy(() => import('./components/AlbumsList'));
const PopularArtists = lazy(() => import('./main_components/PopularArtists'));
const PopularAlbums = lazy(() => import('./main_components/PopularAlbums'));
const PopularRadio = lazy(() => import('./main_components/PopularRadio'));
const Footer = lazy(() => import('./components/Footer'));

// Current client ID and secret for the home page and general use 
const currentClientId = '67beae129b984e44865838e743c59c11';
const currentClientSecret = '519c08415d064d31b478769b62090e04';

// Function to get a token using the current client ID and secret
const getToken = async () => {
  try {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(currentClientId + ':' + currentClientSecret),
      },
      body: 'grant_type=client_credentials',
    });
    const data = await result.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

function App() {
  const [albums, setAlbums] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [popularArtists, setPopularArtists] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [popularRadio, setPopularRadio] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = await getToken();

        // Fetch popular artists
        const artistsResponse = await fetch(
          'https://api.spotify.com/v1/artists?ids=1Xyo4u8uXC1ZmMpatF05PJ,246dkjvS1zLTtiykXe5h60,06HL4z0CvFAxyc27GXpf02,3TVXtAsR1Inumwj472S9r4,4q3ewBCX7sLwd24euuV69X,66CXWjxzNUsdJxJ2JdwvnR,3fMbdgg4jU18AjLCKBhRSm,5K4W6rqBFWDnAN6FQUkS6x',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const artistsData = await artistsResponse.json();
        setPopularArtists(artistsData.artists);

        // Fetch popular albums
        const albumsResponse = await fetch('https://api.spotify.com/v1/browse/new-releases', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const albumsData = await albumsResponse.json();
        setPopularAlbums(albumsData.albums.items);

        // Fetch popular radio playlists
        const radioResponse = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const radioData = await radioResponse.json();
        setPopularRadio(radioData.playlists.items);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (isActive) => {
    setIsSearchActive(isActive);
  };

  const getTracks = async (id, type = 'album') => {
    try {
      const token = await getToken();
      let url;

      if (type === 'album') {
        url = `https://api.spotify.com/v1/albums/${id}/tracks`;
      } else if (type === 'artist') {
        url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`;
      } else if (type === 'playlist') {
        url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
      }

      const result = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();

      const playableTrack =
        type === 'artist'
          ? data.tracks && data.tracks.find(track => track.preview_url)
          : data.items && data.items.find(item => item.preview_url || (item.track && item.track.preview_url));

      if (playableTrack) {
        setCurrentTrack(playableTrack.track || playableTrack);
        setIsPlaying(true);
      } else {
        setCurrentTrack(null);
        setIsPlaying(false);
        alert('No playable tracks found.');
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar setAlbums={setAlbums} onSearch={handleSearch} />
        <NavigationTabs />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={
              !isSearchActive && (
                <>
                  <PopularArtists artists={popularArtists} onArtistClick={id => getTracks(id, 'artist')} />
                  <PopularAlbums albums={popularAlbums} onAlbumClick={id => getTracks(id, 'album')} />
                  <PopularRadio radio={popularRadio} onRadioClick={id => getTracks(id, 'playlist')} />
                </>
              )
            } />
            <Route path="/music" element={<Music setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/audiobooks" element={<Audiobooks />} />
            <Route path="/albums" element={<AlbumsList albums={albums} onAlbumClick={id => getTracks(id, 'album')} />} />
          </Routes>
        </Suspense>
        {currentTrack && (
          <StickyPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
          />
        )}
        <Suspense fallback={<div>Loading footer...</div>}>
          <Footer />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
