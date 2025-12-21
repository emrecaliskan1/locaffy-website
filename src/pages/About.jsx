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
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Hakkımızda
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '56rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.8,
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Biz Locaffy ekibiyiz.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '56rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.8,
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Günlük hayatta sıkça yaşanan "Nereye gidelim?" kararsızlığını daha az yaşamak için yola çıktık.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '56rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.8,
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Locaffy'yi; bulunduğun konuma göre kafe ve restoranları kolayca keşfedebileceğin, menülere göz atabileceğin ve gitmeden önce yerini ayırt edebileceğin bir deneyim olarak tasarladık.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '56rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Amacımız, keşfetmeyi kolaylaştıran ve karar vermeyi hızlandıran bir platform sunmak.
          </Typography>
        </Container>
      </AboutHeroSection>

      <Box sx={{ py: 10, background: 'white' }}>
        <Container maxWidth="md">
          {/* Mission */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: 'grey.800',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <span style={{ fontSize: '2rem' }}>🎯</span>
              Misyonumuz
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.9, mb: 2, fontSize: '1.1rem' }}>
              İnsanların bulundukları konuma en uygun mekanları hızlı ve zahmetsiz şekilde keşfetmesini sağlamak.
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.9, fontSize: '1.1rem' }}>
              Karar verme sürecini basitleştirerek, daha keyifli sosyal deneyimlerin önünü açmak.
            </Typography>
          </Box>

          {/* Vision */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: 'grey.800',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <span style={{ fontSize: '2rem' }}>🔭</span>
              Vizyonumuz
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.9, mb: 2, fontSize: '1.1rem' }}>
              Kafe ve restoran keşfini herkes için kolay, hızlı ve erişilebilir hale getiren,
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.9, fontSize: '1.1rem' }}>
              konum tabanlı deneyimde kullanıcıların ilk tercihi olan bir platform olmak.
            </Typography>
          </Box>

          {/* Values */}
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: 'grey.800',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <span style={{ fontSize: '2rem' }}>💎</span>
              Değerlerimiz
            </Typography>
            <Box sx={{ color: 'grey.700', lineHeight: 1.9, fontSize: '1.1rem' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Kullanıcı Odaklılık</strong> – Gerçek ihtiyaçlara odaklanırız.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Sadelik</strong> – Karmaşık değil, anlaşılır çözümler üretiriz.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Güven</strong> – Kullanıcı verilerinin güvenliğini ön planda tutarız.
              </Typography>
              <Typography variant="body1">
                <strong>Sürekli Gelişim</strong> – Deneyimi her zaman daha iyi hale getirmeyi hedefleriz.
              </Typography>
            </Box>
          </Box>
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
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={3}>
              <TeamCard>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Mehmet Enes Varım
                </Typography>
              </TeamCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TeamCard>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Emre Çalışkan
                </Typography>
              </TeamCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TeamCard>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Esra Yıldırım
                </Typography>
              </TeamCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TeamCard>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Berna Yeşilyurt
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