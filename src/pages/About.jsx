import React from 'react';
import '../../styles/About.css';

const About = () => {
  return (
    <main>
      <section className="about-hero">
        <div className="container">
          <h1>Hakkımızda</h1>
          <p>Locaffy ekibi olarak, sosyal bağlantıları güçlendiren teknolojiler geliştiriyoruz.</p>
        </div>
      </section>
      
      <section className="about-content">
        <div className="container">
          <div className="about-cards-grid">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3>Misyonumuz</h3>
              <p>
                İnsanları bir araya getiren, anlamlı bağlantılar kurmalarını sağlayan ve sosyal deneyimlerini zenginleştiren 
                teknolojiler geliştirmek için varız. Locaffy ile dünyanın her yerinden insanlar, ortak ilgi alanları 
                etrafında buluşup yeni dostluklar kurabiliyor.
              </p>
            </div>
            
            <div className="about-card">
              <div className="about-card-icon">🔭</div>
              <h3>Vizyonumuz</h3>
              <p>
                Dünyanın en kullanıcı dostu sosyal keşif platformu olmak ve her bireyin kendine uygun toplulukları 
                bulmasına yardımcı olmak vizyonumuzun merkezinde yer alıyor. Teknoloji ile insan ilişkilerini 
                güçlendirmeyi amaçlıyoruz.
              </p>
            </div>
            
            <div className="about-card">
              <div className="about-card-icon">💎</div>
              <h3>Değerlerimiz</h3>
              <p>
                Güvenlik, şeffaflık, kullanıcı odaklılık ve yenilikçilik temel değerlerimizdir. Her kullanıcımızın 
                güvenli bir ortamda, kendi hızında sosyal bağlantılar kurabilmesi için çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <h2>Ekibimiz</h2>
          <p className="team-subtitle">
            Deneyimli ve tutkulu ekibimizle, kullanıcılarımız için en iyi deneyimi sunmaya odaklanıyoruz.
          </p>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-card-icon">👨‍💻</div>
              <h3>Geliştirme Ekibi</h3>
              <p>
                Yazılım geliştirme ekibimiz, en son teknolojilerle güvenli ve 
                kullanışlı çözümler üretir.
              </p>
            </div>
            
            <div className="team-card">
              <div className="team-card-icon">🎨</div>
              <h3>Tasarım Ekibi</h3>
              <p>
                Tasarımcılarımız, kullanıcı deneyimini ön planda tutarak 
                kullanışlı ve modern arayüzler tasarlar.
              </p>
            </div>
            
            <div className="team-card">
              <div className="team-card-icon">📊</div>
              <h3>Analitik Ekibi</h3>
              <p>
                Veri analisti uzmanlarımız, kullanıcı davranışlarını analiz ederek 
                platformumuzu sürekli iyileştirir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;