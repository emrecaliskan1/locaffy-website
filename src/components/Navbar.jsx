import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: '/', name: 'Ana Sayfa' },
    { path: '/about', name: 'Hakkımızda' },
    { path: '/contact', name: 'İletişim' }
  ];

  return (
    <header className={`navbar ${!isVisible ? 'hidden' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <div className="logo-icon">L</div>
            <h1 className="logo-text">Locaffy</h1>
          </Link>
          
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="nav-buttons">
            <button className="btn btn-secondary">
              Giriş Yap
            </button>
            <button className="btn btn-primary">
              Kaydol
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;