import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../../redux/actions/userAction';
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get user from local storage
  const user = localStorage.getItem('UserIDName');
  const [isUrdu, setIsUrdu] = useState(i18n.language === 'ur');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.removeItem('UserIDName');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
    
  const handleLanguageToggle = () => {
    const newLanguage = isUrdu ? 'en' : 'ur';
    i18n.changeLanguage(newLanguage);
    setIsUrdu(!isUrdu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
   // Define routes where you DO NOT want the Navbar
   const hideNavbarRoutes = ["/", "/login", "/signup"];

   // If the current path is in hideNavbarRoutes, return null
   if (hideNavbarRoutes.includes(location.pathname)) {
     return null;
   }

  return (
    <Fragment>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/home" className="logo-link">
            <img src={'/logo.png'} alt="Logo" className="logo-image" />
          </Link>
        </div>

        {/* Language Toggle */}
        <ul className="navbar-user-actions">
          <li className="nav-link language-toggle-container">
            <div className={`language-toggle ${isUrdu ? 'urdu' : 'english'}`} onClick={handleLanguageToggle}>
              <span className={`toggle-option ${!isUrdu ? 'active_tog' : ''}`}>en</span>
              <span className={`toggle-option ${isUrdu ? 'active_tog' : ''}`}>ur</span>
              <div className="toggle-slider"></div>
            </div>
          </li>

          {/* User Dropdown */}
          {user && (
            <li className="dropdown" ref={dropdownRef}>
              <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle className="user-icon" /> <FaChevronDown />
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </Fragment>
  );
};

export default Navbar;