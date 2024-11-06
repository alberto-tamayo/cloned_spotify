import React from 'react';
import { Link } from 'react-router-dom';

const NavigationTabs = () => {
  return (
    <div className="navigation-tabs">
      <Link to="/" className="tab">All</Link>
      <Link to="/music" className="tab">Music</Link>
      <Link to="/podcasts" className="tab">Podcasts</Link>
      <Link to="/audiobooks" className="tab">Audiobooks</Link>
    </div>
  );
};

export default NavigationTabs;
