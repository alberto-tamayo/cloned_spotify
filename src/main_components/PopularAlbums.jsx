import React from 'react';

const PopularAlbums = ({ albums, onAlbumClick }) => (
  <div className="section">
    <h2 className="section-title">Popular Albums</h2>
    <div className="horizontal-scroll-container">
      {albums.slice(0, 6).map(album => ( // Limit to the first 6 albums
        <div
          key={album.id}
          className="album-card"
          onClick={() => onAlbumClick(album.id)}
        >
          <img src={album.images[0]?.url} alt={album.name} className="album-image" />
          <p className="album-name">{album.name}</p>
          <p className="album-artist">{album.artists[0].name}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PopularAlbums;
