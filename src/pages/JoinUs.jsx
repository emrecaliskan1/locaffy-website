import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography
} from '@mui/material';
import { JoinUsHeroSection, JoinUsButton } from '../components/ui';

function JoinUs() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/business-application');
  };

  return (
    <Box component="main">
      <JoinUsHeroSection variant="fullHeight">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              cursor: 'pointer'
            }}
          >
            Locaffy Ailesine Katılın
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
            <h2>
              Kafenizi, restoranınızı veya pub'ınızı dijital dünyaya taşıyın!</h2>
            <p>
              Müşterileriniz artık telefonlarından kolayca rezervasyon yapabilir,
              Menünüzü hızlıca görebilir, sizi değerlendirip yorum yaparak öne çıkarabilir..</p>
            <p>
              Siz sadece işinize odaklanın; biz rezervasyon ve müşteri yönetimini sizin için kolaylaştıralım.</p>
          </Typography>
          <JoinUsButton size="large" onClick={handleJoinClick}>
            Hemen Katıl
          </JoinUsButton>
        </Container>
      </JoinUsHeroSection>
    </Box>
  );
}

export default JoinUs;