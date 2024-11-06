import React from 'react';

const PopularRadio = ({ radio, onRadioClick }) => (
  <div className="section">
    <h2 className="section-title">Popular Radio</h2>
    <div className="horizontal-scroll-container">
      {radio.slice(0, 6).map(station => ( // Limit to the first 6 radio stations
        <div
          key={station.id}
          className="radio-card"
          onClick={() => onRadioClick(station.id)}
        >
          <img src={station.images[0]?.url} alt={station.name} className="radio-image" />
          <p className="radio-name">{station.name}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PopularRadio;
