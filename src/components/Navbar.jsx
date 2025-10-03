import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import {LogoIcon,NavLink,GradientButton } from './ui/NavbarStyledComponents'

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

  const navItems = [
    { path: '/', name: 'Ana Sayfa' },
    { path: '/about', name: 'Hakkımızda' },
    { path: '/contact', name: 'İletişim' },
    { path: '/joinus', name: 'Bize Katıl' }
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'white',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <ButtonBase
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <LogoIcon>L</LogoIcon>
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
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  active={location.pathname === item.path ? 1 : 0}
                >
                  {item.name}
                </NavLink>
              ))}
            </Box>

            <Stack direction="row" spacing={1.5}>
              <GradientButton variant="secondary">
                Giriş Yap
              </GradientButton>
              <GradientButton variant="primary">
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