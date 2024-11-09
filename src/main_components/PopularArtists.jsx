import React from 'react';

const PopularArtists = ({ artists, onArtistClick }) => (
  <div className="section">
    <h2 className="section-title">Popular Artists</h2>
    <div className="horizontal-scroll-container">
      {artists.slice(0, 8).map(artist => (
        <div key={artist.id} className="artist-card" onClick={() => onArtistClick(artist.id)}>
          <img
            src={artist.images[0]?.url || 'default-image-url'}
            alt={artist.name}
            className="artist-image"
          />
          <p className="artist-name">{artist.name}</p> 
        </div>
      ))}
    </div>
  </div>
);

//Put your css below

export default PopularArtists;
