import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
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
import { features } from '../data/HomePage/features';
import { appFeatures } from '../data/HomePage/appFeatures';

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

  return (
    <Box component="main">
      <HeroSection id="home">
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  lineHeight: 1.2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Locaffy ile Mükemmel Sosyal Deneyimi Keşfedin
              </Typography>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: '48rem',
                  mx: 'auto',
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                Locaffy, arkadaşlarınızla plan yapmanızı kolaylaştırır, sosyal etkinliklerinizi düzenlemenizi sağlar,
                yakınınızdaki mekanları keşfetmenizi ve menülerini incelemenizi sağlar.
              </Typography>
            </motion.div>
            <motion.div variants={scaleIn}>
              <HeroButton variant="primary" size="large">
                Uygulamayı İndir
              </HeroButton>
            </motion.div>
          </motion.div>
        </Container>
      </HeroSection>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Box sx={{ py: 8, background: 'white', m: { xs: 2, md: 3 }, borderRadius: 2 }}>
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
                  fontSize: { xs: '1.75rem', md: '3rem' }
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
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Locaffy ile sosyal hayatınız hiç bu kadar kolay olmamıştı. İşte uygulamamızın sunduğu bazı avantajlar:
              </Typography>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  gap: { xs: 2, md: 4 },
                  flexWrap: 'wrap'
                }}
              >
                {features.map((feature, index) => (
                  <motion.div key={index} variants={scaleIn} style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <FeatureCard>
                        <FeatureIcon>{feature.icon}</FeatureIcon>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.800' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.600', flexGrow: 1 }}>
                          {feature.description}
                        </Typography>
                      </FeatureCard>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
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
                  color: 'grey.800'
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
                spacing={{ xs: 2, md: 3 }}
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
        <Box sx={{ py: 10, background: 'white', textAlign: 'center' }}>
          <Container maxWidth="lg">
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'grey.800'
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
              >
                Uygulamayı İndir
              </PrimaryButton>
            </motion.div>
          </Container>
        </Box>
      </motion.div>

      <motion.div
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <About />
      </motion.div>

      <motion.div
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Contact />
      </motion.div>

      <motion.div
        id="joinus"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <JoinUs />
      </motion.div>
    </Box>
  );
};

export default Home;