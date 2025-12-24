import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import About from './About';
import Contact from './Contact';
import JoinUs from './JoinUs';
import {
  HeroSection,
  HeroButton,
  FeatureCard,
  FeatureIcon,
  AppFeatureCard,
  AppFeatureImage,
  PrimaryButton
} from '../components/ui';
import { features, compactFeatures } from '../data/HomePage/features';
import { appFeatures } from '../data/HomePage/appFeatures';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Home = () => {
  const handleDownload = () => {
    // APK dosyasını indirme linki - public klasörüne locaffy.apk dosyasını koyun
    const link = document.createElement('a');
    link.href = '/locaffy.apk';
    link.download = 'Locaffy.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box component="main">
      {/* Hero Section - Başlık ve Buton */}
      <HeroSection id="home">
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            {/* Left Column - Text Content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotateX: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ 
                    duration: 1, 
                    ease: [0.6, -0.05, 0.01, 0.99],
                    scale: {
                      type: "spring",
                      damping: 10,
                      stiffness: 100
                    }
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      lineHeight: 1.2,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                      textAlign: { xs: 'center', md: 'left' },
                      color: 'white',
                      cursor: 'pointer',
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    ŞEHRİNİ KEŞFETMEYE HAZIR MISIN?
                  </Typography>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.3,
                      duration: 0.8
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      opacity: 0.95,
                      lineHeight: 1.6,
                      textAlign: { xs: 'center', md: 'left' },
                      fontWeight: 500,
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 'bold',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': {
                            opacity: 1
                          },
                          '50%': {
                            opacity: 0.8
                          }
                        }
                      }}
                    >
                      "Nereye gidelim?"
                    </Box>
                    {' '}Sorusunun Resmi Cevabı.
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      lineHeight: 1.6,
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    En İyi Mekanlara Kolay Rezervasyon Artık Parmaklarınızın Ucunda!
                  </Typography>
                </motion.div>
                <motion.div
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <HeroButton variant="primary" size="large" onClick={handleDownload}>
                      Uygulamayı İndir
                    </HeroButton>
                  </Box>
                </motion.div>

                {/* Compact Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                      gap: { xs: 1.5, sm: 2, md: 2.5 },
                      mt: { xs: 3, md: 4 },
                      maxWidth: { xs: '100%', md: '900px' },
                      mx: 'auto'
                    }}
                  >
                    {compactFeatures.map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: { xs: 0.3, sm: 0.5 },
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          padding: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateY(-5px) scale(1.05)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .feature-icon': {
                              transform: 'scale(1.2) rotate(5deg)',
                            }
                          }
                        }}
                      >
                        <Box
                          className="feature-icon"
                          sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            textAlign: 'center',
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                            textAlign: 'center'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Right Column - Visual Content */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: { xs: '320px', sm: '400px', md: '500px' },
                    mx: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: '350px', sm: '450px', md: '500px' }
                  }}
                >
                  {/* Phone Mockup Container */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '240px', sm: '280px', md: '300px' },
                      height: { xs: '480px', sm: '560px', md: '600px' },
                      background: '#1a1a1a',
                      borderRadius: '45px',
                      padding: '8px',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 255, 255, 0.1)',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': {
                          transform: 'translateY(0px)'
                        },
                        '50%': {
                          transform: 'translateY(-20px)'
                        }
                      }
                    }}
                  >
                    {/* Phone Screen */}
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        background: 'white',
                        borderRadius: '38px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        component="img"
                        src="/Ekran Görüntüsü (421).png"
                        alt="Locaffy App"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Box sx={{ py: { xs: 6, md: 8 }, background: '#f9fafb' }}>
          <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 10 } }}>
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 2,
                  color: 'grey.800',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                  cursor: 'pointer'
                }}
              >
                Locaffy'nin Sunduğu Avantajlar
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: 'grey.600',
                  mb: 6,
                  maxWidth: '48rem',
                  mx: 'auto',
                  fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.8
                }}
              >
                Locaffy ile "Nereye gidelim?" sorusu tarih oluyor.<br />
                Karar vermek kolaylaşıyor, kahveye ulaşmak hızlanıyor ☕
              </Typography>
            </motion.div>
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              navigation={true}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
              }}
              style={{ 
                paddingTop: '20px',
                paddingBottom: '50px',
                paddingLeft: '50px',
                paddingRight: '50px'
              }}
              className="advantages-swiper"
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: { xs: 3, md: 3.5 },
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      borderRadius: 3,
                      border: '2px solid transparent',
                      backgroundClip: 'padding-box',
                      position: 'relative',
                      height: { xs: '200px', md: '220px' },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.15)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 3,
                        padding: '2px',
                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #8b5cf6)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        transition: 'opacity 0.4s ease'
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.25)',
                        '&::before': {
                          opacity: 1
                        },
                        '& .feature-icon': {
                          transform: 'scale(1.15) rotateY(180deg)',
                        }
                      }
                    }}
                  >
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        fontSize: { xs: '2.5rem', md: '3rem' }, 
                        mb: 1.5,
                        transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: 'grey.800',
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'grey.600',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        lineHeight: 1.5,
                        px: 1
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Container>
        </Box>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Box sx={{ py: 8, background: '#f9fafb' }}>
          <Container maxWidth="xl">
            <motion.div variants={fadeInUp}>
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
                Uygulama Özellikleri
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
                Locaffy uygulaması, sosyal deneyiminizi iyileştirmek için tasarlanmıştır. İşte bazı temel özellikler:
              </Typography>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Grid
                container
                spacing={{ xs: 3, md: 4 }}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'stretch'
                }}
              >
                {appFeatures.map((feature, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <motion.div variants={scaleIn} style={{ width: '100%', maxWidth: '380px' }}>
                      <AppFeatureCard>
                        {feature.image ? (
                          <Box
                            sx={{
                              width: '100%',
                              height: 300,
                              borderRadius: 3,
                              marginBottom: 2,
                              backgroundImage: `url(${feature.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                        ) : (
                          <AppFeatureImage gradient={feature.gradient} />
                        )}
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'grey.800' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.600', flexGrow: 1 }}>
                          {feature.description}
                        </Typography>
                      </AppFeatureCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
      >
        <Box sx={{ py: { xs: 6, md: 10 }, background: 'white', textAlign: 'center' }}>
          <Container maxWidth="lg">
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'grey.800',
                  cursor: 'pointer'
                }}
              >
                Sosyal Deneyiminizi Yeniden Tanımlayın
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'grey.600',
                  mb: 4
                }}
              >
                Locaffy uygulamasını indirin ve sosyal hayatınızı daha keyifli hale getirin.
              </Typography>
            </motion.div>
            <motion.div variants={scaleIn}>
              <PrimaryButton
                variant="primary"
                size="large"
                onClick={handleDownload}
              >
                Uygulamayı İndir
              </PrimaryButton>
            </motion.div>
          </Container>
        </Box>
      </motion.div>

      <Box
        id="about"
        sx={{ scrollMarginTop: '80px' }}
      >
        <About isEmbedded={true} />
      </Box>

      <Box
        id="contact"
        sx={{ scrollMarginTop: '80px' }}
      >
        <Contact isEmbedded={true} />
      </Box>

      <Box
        id="joinus"
        sx={{ scrollMarginTop: '80px' }}
      >
        <JoinUs isEmbedded={true} />
      </Box>
    </Box>
  );
};

export default Home;