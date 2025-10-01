import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Locaffy</h3>
            <p>
              Sosyal bağlantıları güçlendiren, insanları bir araya getiren 
              ve anlamlı deneyimler yaratmayı hedefleyen bir platformuz.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Hızlı Linkler</h3>
            <ul className="footer-links">
              <li><Link to="/about">Hakkımızda</Link></li>
              <li><Link to="/features">Fiyatlandırma</Link></li>
              <li><Link to="/contact">İletişim</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Yasal</h3>
            <ul className="footer-links">
              <li><a href="#">Gizlilik Politikası</a></li>
              <li><a href="#">Kullanım Koşulları</a></li>
              <li><a href="#">Çerez Politikası</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Bizi Takip Edin</h3>
            <div className="social-links">
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Locaffy. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;