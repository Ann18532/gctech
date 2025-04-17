import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('http://localhost:5000/auth/logout', { credentials: 'include' });
    document.cookie = "token=; Max-Age=0";
    window.location.href = 'http://localhost:5173'; // 👈 Redirect to login page
  };

  return (
    <div className="navbar">
      <div className="brand">Unify</div>
      <div className="profile-area">
        <div className="profile-icon" onClick={() => setOpen(!open)}>👤</div>
        {open && (
          <div className="dropdown">
            <div onClick={logout}>🚪 Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
