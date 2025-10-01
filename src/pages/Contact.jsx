import React from 'react';
import '../../styles/Contact.css';

const Contact = () => {
  return (
    <main>
      <section className="contact-hero">
        <div className="container">
          <h1>İletişim</h1>
          <p>Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin.</p>
        </div>
      </section>
      
      <section className="contact-content">
        <div className="container">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Adınız</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-posta Adresiniz</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Konu</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mesajınız</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            
            <button type="submit" className="contact-btn">
              Mesaj Gönder
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;