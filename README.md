<div align="center">
  <h1>Locaffy Website</h1>
  <p>
    <strong>Locaffy platformunun web arayüzü projesidir.</strong><br>
    Bu proje, son kullanıcılar için bilgilendirme sayfaları, işletmeler için yönetim paneli ve platform yöneticileri için super admin panelini içerir.
  </p>
</div>

<hr />

<h2>🚀 Proje Hakkında</h2>
<p>
  Locaffy Website, modern web teknolojileri kullanılarak geliştirilmiş, performanslı ve kullanıcı dostu bir Single Page Application (SPA) projesidir. İşletmelerin başvurularını yapabileceği, menülerini ve rezervasyonlarını yönetebileceği kapsamlı bir yönetim paneli sunar.
</p>

<h2>✨ Özellikler</h2>

<h3>🌍 Genel (Public)</h3>
<ul>
  <li><strong>Ana Sayfa:</strong> Platform tanıtımı ve özelliklerin sergilenmesi.</li>
  <li><strong>Hakkımızda & İletişim:</strong> Kurumsal bilgiler ve iletişim formları.</li>
  <li><strong>İşletme Başvurusu:</strong> Yeni işletmelerin platforma katılmak için başvuru yapabileceği form.</li>
  <li><strong>QR Menü:</strong> İşletmelerin dijital menülerinin görüntülenmesi.</li>
</ul>

<h3>🏢 İşletme Paneli (Admin)</h3>
<ul>
  <li>
    <strong>Dashboard:</strong>
    <ul>
      <li>Günlük, haftalık ve aylık rezervasyon istatistikleri.</li>
      <li>Bekleyen rezervasyon taleplerinin hızlı görünümü.</li>
    </ul>
  </li>
  <li>
    <strong>Menü Yönetimi:</strong>
    <ul>
      <li>Kategori oluşturma ve yönetme.</li>
      <li>Ürün ekleme, düzenleme, silme ve fiyat güncelleme.</li>
      <li>Ürün görselleri yükleme ve stok durumu (aktif/pasif) yönetimi.</li>
      <li>Ürünlere etiket (Vegan, Glutensiz vb.) ekleme.</li>
      <li>Menü öğelerinin sıralamasını değiştirme.</li>
      <li>QR Menü oluşturma ve görüntüleme.</li>
    </ul>
  </li>
  <li>
    <strong>Rezervasyon Yönetimi:</strong>
    <ul>
      <li>Gelen rezervasyon taleplerini görüntüleme (Beklemede, Onaylandı, Reddedildi vb.).</li>
      <li>Rezervasyonları onaylama, reddetme veya iptal etme.</li>
      <li>Rezervasyon detaylarını (kişi sayısı, tarih, saat, notlar) inceleme.</li>
      <li>Geçmiş ve gelecek rezervasyonları filtreleme.</li>
    </ul>
  </li>
  <li>
    <strong>Rezervasyon Kuralları:</strong>
    <ul>
      <li>İşletme çalışma saatlerini (Açılış-Kapanış) belirleme.</li>
      <li>Haftanın çalışma günlerini ayarlama.</li>
      <li>Rezervasyon aralıklarını ve masa kapasitelerini yönetme.</li>
    </ul>
  </li>
  <li>
    <strong>İşletme Ayarları:</strong>
    <ul>
      <li>Mekan adı, logosu ve kapak fotoğrafını güncelleme.</li>
      <li>İletişim bilgileri ve adres düzenleme.</li>
    </ul>
  </li>
  <li>
    <strong>Yorumlar & Değerlendirmeler:</strong>
    <ul>
      <li>Müşterilerden gelen yorumları ve puanları görüntüleme.</li>
      <li>Yorumlara yanıt verme ve geri bildirim yönetimi.</li>
    </ul>
  </li>
</ul>

<h3>⚡ Super Admin Paneli</h3>
<ul>
  <li><strong>Başvuru Yönetimi:</strong> Gelen işletme başvurularının onaylanması/reddedilmesi.</li>
  <li><strong>İşletme Yönetimi:</strong> Platformdaki tüm işletmelerin listelenmesi ve yönetimi.</li>
  <li><strong>Kullanıcı Yönetimi:</strong> Sistem kullanıcılarının yönetimi.</li>
</ul>

<h2>🛠 Teknolojiler</h2>
<p>Bu proje aşağıdaki teknolojiler kullanılarak geliştirilmiştir:</p>
<ul>
  <li><strong>Core:</strong> <a href="https://react.dev/">React</a> (v19), <a href="https://vitejs.dev/">Vite</a></li>
  <li><strong>Routing:</strong> <a href="https://reactrouter.com/">React Router DOM</a></li>
  <li><strong>UI Framework & Styling:</strong>
    <ul>
      <li><a href="https://mui.com/">Material UI (MUI)</a></li>
      <li><a href="https://emotion.sh/">Emotion</a> (Styled Components)</li>
      <li><a href="https://www.framer.com/motion/">Framer Motion</a> (Animasyonlar)</li>
      <li><a href="https://headlessui.com/">Headless UI</a></li>
    </ul>
  </li>
  <li><strong>Harita:</strong> <a href="https://leafletjs.com/">Leaflet</a> & <a href="https://react-leaflet.js.org/">React Leaflet</a></li>
  <li><strong>HTTP Client:</strong> <a href="https://axios-http.com/">Axios</a></li>
  <li><strong>Diğer:</strong> React QR Code, FontAwesome</li>
</ul>

<h2>⚙️ Kurulum ve Çalıştırma</h2>
<p>Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.</p>

<h3>Ön Koşullar</h3>
<ul>
  <li>Node.js (v18 veya üzeri önerilir)</li>
  <li>npm veya yarn</li>
</ul>

<h3>Adımlar</h3>

<ol>
  <li>
    <strong>Projeyi Klonlayın</strong>
    <pre><code>git clone https://github.com/emrecaliskan1/locaffy-website.git
cd locaffy-website</code></pre>
  </li>
  <li>
    <strong>Bağımlılıkları Yükleyin</strong>
    <pre><code>npm install
# veya
yarn install</code></pre>
  </li>
  <li>
    <strong>Geliştirme Sunucusunu Başlatın</strong>
    <pre><code>npm run dev
# veya
yarn dev</code></pre>
    <p>Proje genellikle <code>http://localhost:5173</code> adresinde çalışacaktır.</p>
  </li>
</ol>

<h2>📜 Mevcut Komutlar</h2>
<p><code>package.json</code> dosyasında tanımlı komutlar:</p>

<table>
  <thead>
    <tr>
      <th>Komut</th>
      <th>Açıklama</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>npm run dev</code></td>
      <td>Geliştirme sunucusunu başlatır (Hot Reload ile).</td>
    </tr>
    <tr>
      <td><code>npm run build</code></td>
      <td>Projeyi production (canlı) ortamı için derler.</td>
    </tr>
    <tr>
      <td><code>npm run preview</code></td>
      <td>Derlenmiş projeyi yerel olarak önizler.</td>
    </tr>
    <tr>
      <td><code>npm run lint</code></td>
      <td>Kod standartlarını kontrol eder (ESLint).</td>
    </tr>
  </tbody>
</table>

<h2>📂 Proje Yapısı</h2>
<pre><code>src/
├── admin/           # İşletme paneli sayfaları ve bileşenleri
├── assets/          # Görseller, ikonlar ve statik dosyalar
├── components/      # Genel kullanıma açık UI bileşenleri (Button, Navbar vb.)
├── data/            # Sabit veriler ve içerikler
├── layouts/         # Sayfa düzenleri (Layouts)
├── pages/           # Genel (Public) sayfalar (Home, About, Login vb.)
├── router/          # React Router konfigürasyonu ve rota tanımları
├── services/        # API servisleri (Axios istekleri)
├── superadmin/      # Super admin paneli sayfaları
├── App.jsx          # Ana uygulama bileşeni
└── main.jsx         # Uygulama giriş noktası</code></pre>

<h2>🚀 Dağıtım (Deployment)</h2>
<p>Bu proje <strong>Vercel</strong> üzerinde çalışacak şekilde yapılandırılmıştır (<code>vercel.json</code>).</p>
<p>Production build almak için:</p>
<pre><code>npm run build</code></pre>
<p>Bu komut <code>dist</code> klasörüne optimize edilmiş dosyaları oluşturur.</p>


<h2>📄 Lisans</h2>
<p>Bu proje özel bir lisansa sahiptir. İzinsiz kopyalanması veya dağıtılması yasaktır.</p>
