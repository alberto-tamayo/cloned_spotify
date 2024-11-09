import React from 'react';

const TrackList = ({ tracks }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div key={track.id} className="track">
          <p>{track.name}</p>
          {track.preview_url ? (
            <audio controls>
              <source src={track.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>No preview available</p>
          )}
        </div>
      ))}
    </div>
  );
};

//Put your css below

export default TrackList;
