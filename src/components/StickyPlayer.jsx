import React, { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const StickyPlayer = ({ track, isPlaying, onPlayPause }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setAudioDuration);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
      }
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Provide a fallback image if the album image is missing or an error occurs
  const imageSrc = imageError || !track.album?.images?.[0]?.url 
    ? 'https://cdn-icons-png.flaticon.com/512/2111/2111624.png' 
    : track.album.images[0].url;

  return (
    <div className="sticky-player">
      <div className="track-details">
        <img
          src={imageSrc}
          alt={track.album ? track.album.name : 'Album cover'}
          className="album-cover"
          onError={handleImageError}
        />
        <div className="track-info">
          <p className="track-name">{track.name}</p>
          <p className="track-artist">{track.artists && track.artists[0].name}</p>
        </div>
      </div>
      <div className="center-controls">
        <button onClick={onPlayPause} className="play-pause-btn">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="progress-container">
          <span className="current-time">{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
      <audio ref={audioRef} src={track.preview_url} />
    </div>
  );
};

//Put your css below

export default StickyPlayer;