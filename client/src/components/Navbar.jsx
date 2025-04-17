import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT cookie
    document.cookie = 'token=; Max-Age=0; path=/;';
  
    // Redirect to the frontend homepage (e.g., /)
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">🧩 Unify ERP</h1>
      <div className="navbar-profile">
        <img
          src="/profile-icon.png"
          alt="profile"
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
