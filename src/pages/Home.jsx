import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import {
  HeroSection,
  HeroButton,
  FeatureCard,
  FeatureIcon,
  AppFeatureCard,
  AppFeatureImage,
  PrimaryButton,
  StyledButton,
  StyledCard
} from '../components/ui';
import { features } from '../data/HomePage/features';
import { appFeatures } from '../data/HomePage/appFeatures';

const Home = () => {

  return (
    <Box component="main">
      <HeroSection>
        <Container maxWidth="lg">
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
          <HeroButton size="large">
            Uygulamayı İndir
          </HeroButton>
        </Container>
      </HeroSection>

      <Box sx={{ py: 8, background: 'white', m: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Container maxWidth={false} sx={{ px: 10 }}>
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
            Locaffy'nin Sunduğu Avantajlar
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
            Locaffy ile sosyal hayatınız hiç bu kadar kolay olmamıştı. İşte uygulamamızın sunduğu bazı avantajlar:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: 4,
              '@media (max-width: 1200px)': {
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3
              }
            }}
          >
            {features.map((feature, index) => (
              <Box key={index} sx={{display: 'flex', justifyContent: 'center' }}>
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
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 8, background: '#f9fafb' }}>
        <Container maxWidth="xl">
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
          <Grid 
            container 
            spacing={4}
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              mx: -5,
              flexWrap: 'nowrap',
              '@media (max-width: 1200px)': {
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3
              }
            }}
          >
            {appFeatures.map((feature, index) => (
              <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <AppFeatureCard>
                  <AppFeatureImage gradient={feature.gradient} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'grey.800' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.600', flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                </AppFeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, background: 'white', textAlign: 'center' }}>
        <Container maxWidth="lg">
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
          <PrimaryButton
            size="large"
          >
            Uygulamayı İndir
          </PrimaryButton>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;