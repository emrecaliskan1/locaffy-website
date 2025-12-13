import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Container,
  Slide,
  useScrollTrigger,
  ButtonBase,
  Stack
} from '@mui/material';
import {NavLink,GradientButton } from './ui/NavbarStyledComponents'

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleNavigation = (item) => {
    if (item.path === '/login' || item.path === '/register' || item.path === '/business-application' || item.path === '/joinus') {
      navigate(item.path);
    } else {
      scrollToSection(item.sectionId);
    }
  };

  const navItems = [
    { path: '/', sectionId: 'home', name: 'Ana Sayfa' },
    { path: '/about', sectionId: 'about', name: 'Hakkımızda' },
    { path: '/contact', sectionId: 'contact', name: 'İletişim' },
    { path: '/business-application', sectionId: 'business-application', name: 'İşletme Başvurusu' },
    { path: '/joinus', sectionId: 'joinus', name: 'Bize Katıl' }
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'white',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <ButtonBase
              onClick={() => scrollToSection('home')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Box
                component="img"
                src="/locaffy%20icon.png"
                alt="Locaffy Icon"
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain'
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'grey.800',
                  textDecoration: 'none',
                }}
              >
                Locaffy
              </Typography>
            </ButtonBase>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.sectionId}
                  onClick={() => handleNavigation(item)}
                  sx={{ cursor: 'pointer' }}
                >
                  {item.name}
                </NavLink>
              ))}
            </Box>

            <Stack direction="row" spacing={1.5}>
              <GradientButton 
                variant="secondary"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Giriş Yap
              </GradientButton>
              <GradientButton 
                variant="primary"
                onClick={() => navigate('/register')}
                sx={{ cursor: 'pointer' }}
              >
                Kaydol
              </GradientButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;