import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import { 
  AboutHeroSection, 
  AboutCard, 
  AboutCardIcon, 
  TeamCard 
} from '../components/ui';

const About = () => {
  return (
    <Box component="main">
      <AboutHeroSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}
          >
            Hakkımızda
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '48rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            Locaffy ekibi olarak, sosyal bağlantıları güçlendiren teknolojiler geliştiriyoruz.
          </Typography>
        </Container>
      </AboutHeroSection>
      
      <Box sx={{ py: 8, background: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Grid 
            container 
            spacing={4}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              '@media (max-width: 1200px)': {
                flexWrap: 'wrap'
              }
            }}
          >
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <AboutCard>
                <AboutCardIcon>🎯</AboutCardIcon>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Misyonumuz
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.7, flexGrow: 1 }}>
                  İnsanları bir araya getiren, anlamlı bağlantılar kurmalarını sağlayan ve sosyal deneyimlerini zenginleştiren 
                  teknolojiler geliştirmek için varız. Locaffy ile dünyanın her yerinden insanlar, ortak ilgi alanları 
                  etrafında buluşup yeni dostluklar kurabiliyor.
                </Typography>
              </AboutCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <AboutCard>
                <AboutCardIcon>🔭</AboutCardIcon>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Vizyonumuz
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.7, flexGrow: 1 }}>
                  Dünyanın en kullanıcı dostu sosyal keşif platformu olmak ve her bireyin kendine uygun toplulukları 
                  bulmasına yardımcı olmak vizyonumuzun merkezinde yer alıyor. Teknoloji ile insan ilişkilerini 
                  güçlendirmeyi amaçlıyoruz.
                </Typography>
              </AboutCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <AboutCard>
                <AboutCardIcon>💎</AboutCardIcon>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Değerlerimiz
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.7, flexGrow: 1 }}>
                  Güvenlik, şeffaflık, kullanıcı odaklılık ve yenilikçilik temel değerlerimizdir. Her kullanıcımızın 
                  güvenli bir ortamda, kendi hızında sosyal bağlantılar kurabilmesi için çalışıyoruz.
                </Typography>
              </AboutCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, background: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              color: 'grey.800'
            }}
          >
            Ekibimiz
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'grey.600',
              mb: 6,
              maxWidth: '48rem',
              mx: 'auto'
            }}
          >
            Deneyimli ve tutkulu ekibimizle, kullanıcılarımız için en iyi deneyimi sunmaya odaklanıyoruz.
          </Typography>
          <Grid 
            container 
            spacing={4}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              '@media (max-width: 1200px)': {
                flexWrap: 'wrap'
              }
            }}
          >
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <TeamCard>
                <AboutCardIcon>👨‍💻</AboutCardIcon>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Geliştirme Ekibi
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.6, flexGrow: 1 }}>
                  Yazılım geliştirme ekibimiz, en son teknolojilerle güvenli ve 
                  kullanışlı çözümler üretir.
                </Typography>
              </TeamCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <TeamCard>
                <AboutCardIcon>🎨</AboutCardIcon>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Tasarım Ekibi
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.6, flexGrow: 1 }}>
                  Tasarımcılarımız, kullanıcı deneyimini ön planda tutarak 
                  kullanışlı ve modern arayüzler tasarlar.
                </Typography>
              </TeamCard>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ minWidth: 0, flex: '1 1 33.33%' }}>
              <TeamCard>
                <AboutCardIcon>📊</AboutCardIcon>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                  Analitik Ekibi
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600', lineHeight: 1.6, flexGrow: 1 }}>
                  Veri analisti uzmanlarımız, kullanıcı davranışlarını analiz ederek 
                  platformumuzu sürekli iyileştirir.
                </Typography>
              </TeamCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;