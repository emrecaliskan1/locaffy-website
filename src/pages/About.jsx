import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
          <Box
            sx={{
              position: 'relative',
              '& .swiper': {
                paddingBottom: '50px'
              },
              '& .swiper-button-prev, & .swiper-button-next': {
                color: '#667eea',
                width: '50px',
                height: '50px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)',
                  color: '#8093f1',
                },
                '&::after': {
                  fontSize: { xs: '20px', md: '24px' },
                  fontWeight: 'bold'
                }
              },
              '& .swiper-pagination': {
                bottom: '10px'
              },
              '& .swiper-pagination-bullet': {
                background: 'rgba(102, 126, 234, 0.3)',
                opacity: 1,
                width: '8px',
                height: '8px',
                transition: 'all 0.3s ease'
              },
              '& .swiper-pagination-bullet-active': {
                background: '#667eea',
                width: '28px',
                borderRadius: '4px'
              }
            }}
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30
                }
              }}
            >
            {/* Mission Card */}
            <SwiperSlide>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '380px',
                  width: '100%',
                  p: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
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
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.8, mb: 2, fontSize: '1rem' }}>
                  İnsanların bulundukları konuma en uygun mekanları hızlı ve zahmetsiz şekilde keşfetmesini sağlamak.
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.8, fontSize: '1rem' }}>
                  Karar verme sürecini basitleştirerek, daha keyifli sosyal deneyimlerin önünü açmak.
                </Typography>
              </Box>
            </SwiperSlide>

            {/* Vision Card */}
            <SwiperSlide>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '380px',
                  width: '100%',
                  p: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
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
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.8, mb: 2, fontSize: '1rem' }}>
                  Kafe ve restoran keşfini herkes için kolay, hızlı ve erişilebilir hale getiren,
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.8, fontSize: '1rem' }}>
                  konum tabanlı deneyimde kullanıcıların ilk tercihi olan bir platform olmak.
                </Typography>
              </Box>
            </SwiperSlide>

            {/* Values Card */}
            <SwiperSlide>
              <Box
                sx={{
                  height: '100%',
                  minHeight: '380px',
                  width: '100%',
                  p: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
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
                <Box sx={{ color: 'grey.700', lineHeight: 1.8, fontSize: '1rem' }}>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#667eea' }}>Kullanıcı Odaklılık</strong> – Gerçek ihtiyaçlara odaklanırız.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#667eea' }}>Sadelik</strong> – Karmaşık değil, anlaşılır çözümler üretiriz.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#667eea' }}>Güven</strong> – Kullanıcı verilerinin güvenliğini ön planda tutarız.
                  </Typography>
                  <Typography variant="body1">
                    <strong style={{ color: '#667eea' }}>Sürekli Gelişim</strong> – Deneyimi her zaman daha iyi hale getirmeyi hedefleriz.
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
            </Swiper>
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