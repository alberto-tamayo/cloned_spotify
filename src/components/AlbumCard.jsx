import React from 'react';

const AlbumCard = ({ album, onAlbumClick }) => {
  const handleClick = () => {
    console.log("Album clicked:", album.id); 
    onAlbumClick(album.id); 
  };

  return (
    <div className="album-card" onClick={handleClick}>
      <img src={album.images[0].url} alt={album.name} className="album-image" />
      <div className="album-info">
        <h3 className="album-name">{album.name}</h3>
        <p className="album-artist">{album.artists[0].name}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
