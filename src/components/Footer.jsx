import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Stack
} from '@mui/material';

import { FooterContainer, FooterLink, SocialIcon } from './ui/FooterStyledComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12} md={2.5}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Locaffy
            </Typography>
            <Typography variant="body2" sx={{ color: '#d1d5db', lineHeight: 1.6, fontSize: '0.875rem' }}>
              Sosyal bağlantıları güçlendiren, insanları bir araya getiren 
              ve anlamlı deneyimler yaratmayı hedefleyen bir platformuz.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={2.5}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Hızlı Linkler
            </Typography>
            <Stack spacing={0.5}>
              <FooterLink component={RouterLink} to="/about">
                Hakkımızda
              </FooterLink>
              <FooterLink component={RouterLink} to="/features">
                Fiyatlandırma
              </FooterLink>
              <FooterLink component={RouterLink} to="/contact">
                İletişim
              </FooterLink>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Yasal
            </Typography>
            <Stack spacing={0.5}>
              <FooterLink href="#">
                Gizlilik Politikası
              </FooterLink>
              <FooterLink href="#">
                Kullanım Koşulları
              </FooterLink>
              <FooterLink href="#">
                Çerez Politikası
              </FooterLink>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold',mx:3,mb:2}}>
              Bizi Takip Edin
            </Typography>
            <Box sx={{ display: 'flex', mx:3 }}>
              <SocialIcon href="#" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></SocialIcon>
              <SocialIcon href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></SocialIcon>
              <SocialIcon href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></SocialIcon>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, backgroundColor: '#374151' }} />
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          © 2025 Locaffy. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;