import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo-section">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="bnb-logo">
          <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16z" fill="#F3BA2F"/>
          <path d="M12.112 13.064L16 9.176l3.888 3.888 2.216-2.216L16 4.744l-6.104 6.104 2.216 2.216zm3.888 6.432l-3.888-3.888-2.216 2.216L16 23.92l6.104-6.104-2.216-2.216-3.888 3.888zm0-4.096l2.128-2.128-2.128-2.128-2.128 2.128 2.128 2.128zM6.92 14.84l2.216-2.216 2.216 2.216-2.216 2.216L6.92 14.84zm13.728-2.216l2.216 2.216-2.216 2.216-2.216-2.216 2.216-2.216z" fill="#fff"/>
        </svg>
        <span className="logo-text">BNB Chain</span>
      </div>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#support">Support</a>
        <a href="#contact">Contact Us</a>
        <a href="#docs">Docs</a>
        <a href="#explorer">Explorer</a>
        <a href="#about">About</a>
        <a href="#bridge">Bridge</a>
      </nav>
      <div className="action-section">
        <button className="btn verify-btn" onClick={() => document.getElementById('verify-section').scrollIntoView({ behavior: 'smooth' })}>
          Verify Now
        </button>
      </div>
    </header>
  );
};

export default Header;
