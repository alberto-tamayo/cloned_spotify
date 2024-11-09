import React from 'react';
import AlbumCard from './AlbumCard';

const AlbumsList = ({ albums, onAlbumClick }) => {
  return (
    <div className="albums-list">
      {albums.length > 0 ? (
        albums.map(album => (
          <AlbumCard key={album.id} album={album} onAlbumClick={onAlbumClick} />
        ))
      ) : (
        <p>No albums found.</p>
      )}
    </div>
  );
};

//Put your css below

export default AlbumsList;
