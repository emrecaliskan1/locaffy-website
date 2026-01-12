import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DiamondIcon from '@mui/icons-material/Diamond';
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
              fontSize: { xs: '2.5rem', md: '3rem' },
              cursor: 'pointer'
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
              mb: 2
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
              mb: 2
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
              mb: 2
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
              lineHeight: 1.8
            }}
          >
            Amacımız, keşfetmeyi kolaylaştıran ve karar vermeyi hızlandıran bir platform sunmak.
          </Typography>
        </Container>
      </AboutHeroSection>

      <Box sx={{ py: 10, background: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
            {/* Mission Card */}
            <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '340px',
                  maxWidth: '350px',
                  width: '100%',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                    opacity: 0,
                    transform: 'scaleX(0)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    '&::after': {
                      opacity: 1,
                      transform: 'scaleX(1)'
                    },
                    '& .icon-box': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)'
                    }
                  }
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    fontSize: '2.75rem',
                    mb: 2.5,
                    display: 'inline-flex',
                    background: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                    borderRadius: '20px',
                    width: '80px',
                    height: '80px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <TrackChangesIcon sx={{ fontSize: 'inherit' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2.5,
                    color: '#2d3748',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Misyonumuz
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.7, mb: 2, fontSize: { xs: '0.95rem', md: '1rem' }, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                  İnsanların bulundukları konuma en uygun mekanları hızlı ve zahmetsiz şekilde keşfetmesini sağlamak.
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.7, fontSize: { xs: '0.95rem', md: '1rem' }, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                  Karar verme sürecini basitleştirerek, daha keyifli sosyal deneyimlerin önünü açmak.
                </Typography>
              </Box>
            </Grid>

            {/* Vision Card */}
            <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '340px',
                  maxWidth: '350px',
                  width: '100%',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                    opacity: 0,
                    transform: 'scaleX(0)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    '&::after': {
                      opacity: 1,
                      transform: 'scaleX(1)'
                    },
                    '& .icon-box': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)'
                    }
                  }
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    fontSize: '2.75rem',
                    mb: 2.5,
                    display: 'inline-flex',
                    background: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                    borderRadius: '20px',
                    width: '80px',
                    height: '80px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 'inherit' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2.5,
                    color: '#2d3748',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Vizyonumuz
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.7, mb: 2, fontSize: { xs: '0.95rem', md: '1rem' }, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                  Kafe ve restoran keşfini herkes için kolay, hızlı ve erişilebilir hale getiren,
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.7, fontSize: { xs: '0.95rem', md: '1rem' }, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                  Konum tabanlı deneyimde kullanıcıların ilk tercihi olan bir platform olmak.
                </Typography>
              </Box>
            </Grid>

            {/* Values Card */}
            <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '340px',
                  maxWidth: '350px',
                  width: '100%',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                    opacity: 0,
                    transform: 'scaleX(0)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    '&::after': {
                      opacity: 1,
                      transform: 'scaleX(1)'
                    },
                    '& .icon-box': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)'
                    }
                  }
                }}
              >
                <Box
                  className="icon-box"
                  sx={{
                    fontSize: '2.75rem',
                    mb: 2.5,
                    display: 'inline-flex',
                    background: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                    borderRadius: '20px',
                    width: '80px',
                    height: '80px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <DiamondIcon sx={{ fontSize: 'inherit' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2.5,
                    color: '#2d3748',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Değerlerimiz
                </Typography>
                <Box sx={{ color: 'grey.700', lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  <Typography variant="body1" sx={{ mb: 1.5, wordBreak: 'break-word' }}>
                    <strong style={{ color: '#667eea' }}>Kullanıcı Odaklılık</strong> – Gerçek ihtiyaçlara odaklanırız.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5, wordBreak: 'break-word' }}>
                    <strong style={{ color: '#667eea' }}>Sadelik</strong> – Karmaşık değil, anlaşılır çözümler üretiriz.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5, wordBreak: 'break-word' }}>
                    <strong style={{ color: '#667eea' }}>Güven</strong> – Kullanıcı verilerinin güvenliğini ön planda tutarız.
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    <strong style={{ color: '#667eea' }}>Sürekli Gelişim</strong> – Deneyimi her zaman daha iyi hale getirmeyi hedefleriz.
                  </Typography>
                </Box>
              </Box>
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
              color: 'grey.800',
              cursor: 'pointer'
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
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              maxWidth: '1200px',
              mx: 'auto'
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '45%', md: '220px' }, flexShrink: 0 }}>
              <TeamCard sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  mb: 2,
                  mx: 'auto',
                  flexShrink: 0
                }}>
                  <img
                    src="/team/enesvarim.jpeg"
                    alt="Mehmet Enes Varım"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Mehmet Enes Varım
                </Typography>
              </TeamCard>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '45%', md: '220px' }, flexShrink: 0 }}>
              <TeamCard sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  mb: 2,
                  mx: 'auto',
                  flexShrink: 0
                }}>
                  <img
                    src="/team/emre-caliskan.jpg"
                    alt="Emre Çalışkan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Emre Çalışkan
                </Typography>
              </TeamCard>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '45%', md: '220px' }, flexShrink: 0 }}>
              <TeamCard sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  mb: 2,
                  mx: 'auto',
                  backgroundColor: '#e5e7eb',
                  flexShrink: 0
                }}>
                  <img
                    src="/team/esra.png"
                    alt="Esra Yıldırım"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Esra Yıldırım
                </Typography>
              </TeamCard>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '45%', md: '220px' }, flexShrink: 0 }}>
              <TeamCard sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  mb: 2,
                  mx: 'auto',
                  backgroundColor: '#e5e7eb',
                  flexShrink: 0
                }}>
                  <img
                    src="/team/berna.jpeg"
                    alt="Berna Yeşilyurt"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'grey.800', textAlign: 'center' }}>
                  Berna Yeşilyurt
                </Typography>
              </TeamCard>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;