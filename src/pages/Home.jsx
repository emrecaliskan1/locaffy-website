import React from 'react';
import '../../styles/Home.css';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Locaffy ile Mükemmel Sosyal Deneyimi Keşfedin</h1>
          <p>
            Locaffy, arkadaşlarınızla plan yapmanızı kolaylaştırır, sosyal etkinliklerinizi düzenlemenizi sağlar, 
            yakınınızdaki mekanları keşfetmenizi ve menülerini incelemenizi sağlar.
          </p>
          <button className="btn">
            Uygulamayı İndir
          </button>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Locaffy'nin Sunduğu Avantajlar</h2>
          <p className="features-subtitle">
            Locaffy ile sosyal hayatınız hiç bu kadar kolay olmamıştı. İşte uygulamamızın sunduğu bazı avantajlar:
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Kolay Etkinlik Düzenleme</h3>
              <p>Birkaç tıkla arkadaşlarınızla buluşma planları yapın ve etkinlikler düzenleyin.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Yeni Keşifler</h3>
              <p>İlgi alanlarınıza göre arkadaşlarınızla yeni mekanlar keşfedin.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Konum Tabanlı Keşif</h3>
              <p>Yakınınızdaki etkinlikleri ve mekanları harita üzerinden keşfedin.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☕​</div>
              <h3>Anlık Sipariş Verebilme</h3>
              <p>Rezervasyon yaptığınız mekanda kolayca sipariş verebilme imkanı.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-features">
        <div className="container">
          <h2>Uygulama Özellikleri</h2>
          <p className="features-subtitle">
            Locaffy uygulaması, sosyal deneyiminizi iyileştirmek için tasarlanmıştır. İşte bazı temel özellikler:
          </p>
          <div className="app-features-grid">
            <div className="app-feature-card">
              <div className="app-feature-image"></div>
              <h3>Etkinlik Yönetimi</h3>
              <p>Rezervasyonlarınızı kolayca yönetin, değiştirin veya iptal edin.</p>
            </div>
            <div className="app-feature-card">
              <div className="app-feature-image" style={{background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'}}></div>
              <h3>Hızlı Bağlantı</h3>
              <p>Anında konumunuza göre etrafınızdaki mekanları inceleyin.</p>
            </div>
            <div className="app-feature-card">
              <div className="app-feature-image" style={{background: 'linear-gradient(45deg, #10b981, #3b82f6)'}}></div>
              <h3>Konum Tabanlı Arama</h3>
              <p>Yakınınızdaki mekanları harita üzerinden keşfedin.</p>
            </div>
            <div className="app-feature-card">
              <div className="app-feature-image" style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}></div>
              <h3>Anlık Sipariş</h3>
              <p>Rezervasyon yaptığınız mekanlarda kolayca sipariş verin.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Sosyal Deneyiminizi Yeniden Tanımlayın</h2>
          <p>Locaffy uygulamasını indirin ve sosyal hayatınızı daha keyifli hale getirin.</p>
          <button className="btn btn-primary">
            Uygulamayı İndir
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;