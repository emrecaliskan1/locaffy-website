import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Stack
} from '@mui/material';

import {
  GradientFooterContainer,
  PrimaryFooterLink,
  SecondaryFooterLink,
  RoundedSocialIcon
} from './ui/FooterStyledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <GradientFooterContainer component="footer">
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12} md={2.5}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Locaffy
            </Typography>
            <Typography variant="body2" sx={{ color: '#e5e7eb', lineHeight: 1.6, fontSize: '0.875rem' }}>
              Sosyal bağlantıları güçlendiren, insanları bir araya getiren
              ve anlamlı deneyimler yaratmayı hedefleyen bir platformuz.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Hızlı Linkler
            </Typography>
            <Stack spacing={0.5}>
              <PrimaryFooterLink component={RouterLink} to="/about">
                Hakkımızda
              </PrimaryFooterLink>
              <PrimaryFooterLink component={RouterLink} to="/features">
                Fiyatlandırma
              </PrimaryFooterLink>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Yasal
            </Typography>
            <Stack spacing={0.5}>
              <SecondaryFooterLink href="#">
                Gizlilik Politikası
              </SecondaryFooterLink>
              <SecondaryFooterLink href="#">
                Kullanım Koşulları
              </SecondaryFooterLink>
              <SecondaryFooterLink href="#">
                Çerez Politikası
              </SecondaryFooterLink>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' }
          }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Bizi Takip Edin
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <RoundedSocialIcon href="https://www.instagram.com/_locaffy_/" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></RoundedSocialIcon>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.875rem', mb: 1 }}>
          İletişim için : locaffy2025@gmail.com
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.875rem' }}>
          © 2025 Locaffy. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </GradientFooterContainer>
  );
};

export default Footer;