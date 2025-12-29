import React, { useState } from 'react';
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
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, GradientButton } from './ui/NavbarStyledComponents'

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    setMobileOpen(false); // Close drawer on navigation
    if (item.path === '/login' || item.path === '/register' || item.path === '/business-application' || item.path === '/joinus') {
      navigate(item.path);
    } else {
      scrollToSection(item.sectionId);
    }
  };

  const navItems = [
    { path: '/', sectionId: 'home', name: 'Ana Sayfa' },
    { path: '/about', sectionId: 'about', name: 'Hakkımızda' },
    { path: '/business-application', sectionId: 'business-application', name: 'İşletme Başvurusu' },
    { path: '/joinus', sectionId: 'joinus', name: 'Bize Katıl' }
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.800' }}>
          Menü
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.sectionId} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item)}>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: 'grey.700'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <GradientButton
          variant="secondary"
          onClick={() => {
            setMobileOpen(false);
            navigate('/login');
          }}
          fullWidth
        >
          Giriş Yap
        </GradientButton>
        <GradientButton
          variant="primary"
          onClick={() => {
            setMobileOpen(false);
            navigate('/register');
          }}
          fullWidth
        >
          Kayıt Ol
        </GradientButton>
      </Box>
    </Box>
  );

  return (
    <>
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
                  variant="h6" 
                  noWrap 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'grey.800'
                  }}
                >
                  Locaffy
                </Typography>
              </ButtonBase>

              {/* Desktop Navigation */}
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

              {/* Desktop Buttons */}
              <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                  Kayıt Ol
                </GradientButton>
              </Stack>

              {/* Mobile Hamburger Menu */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: 'grey.800' }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;