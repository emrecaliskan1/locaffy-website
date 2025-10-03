import React from 'react';
import {
  Box,
  Container,
  Typography
} from '@mui/material';
import { JoinUsHeroSection, JoinUsButton } from '../components/ui';

function JoinUs() {
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
              fontSize: { xs: '2.5rem', md: '3.5rem' }
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
            <h2 className="text-2xl font-bold text-amber-600 mb-3">
              Kafenizi, restoranınızı veya pub’ınızı dijital dünyaya taşıyın!</h2>
            <p className="text-slate-700 leading-relaxed">
              Müşterileriniz artık telefonlarından kolayca rezervasyon yapabilir, 
              QR kod ile sipariş verebilir ve işletmenizin doluluk oranını anında görüntüleyebilir.</p>
            <p className="mt-3 text-slate-600 italic">
              Siz sadece işinize odaklanın; biz rezervasyon ve müşteri yönetimini sizin için kolaylaştıralım.</p>
          </Typography>
          <JoinUsButton size="large">
            Hemen Katıl
          </JoinUsButton>
        </Container>
      </JoinUsHeroSection>
    </Box>
  );
}

export default JoinUs;