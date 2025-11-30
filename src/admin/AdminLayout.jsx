import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Button,
  Container,
  ButtonBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  EventNote as EventNoteIcon,
  Logout as LogoutIcon,
  SupervisorAccount as SuperAdminIcon,
  Business as BusinessIcon,
  TableChart as TableChartIcon,
  Rule as RuleIcon,
  Campaign as CampaignIcon,
  Settings as SettingsIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { reservationService } from '../services/reservationService';

const drawerWidth = 200;

const LogoIcon = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      width: 40,
      height: 40,
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      ...props.sx
    }}
  >
    {children}
  </Box>
);

function AdminLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [businessName, setBusinessName] = useState('İşletme');

  // Business name db'den çekilir.
  useEffect(() => {
    const loadBusinessName = async () => {
      try {
        const places = await reservationService.getMyPlaces();
        if (places && Array.isArray(places) && places.length > 0) {
          const firstPlace = places[0];
          const name = firstPlace.name || firstPlace.placeName || 'İşletme';
          setBusinessName(name);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadBusinessName();
  }, []);

  // URL'ye göre menü tipini belirle
  const isSuperAdmin = location.pathname.includes('/admin/super') || location.pathname.includes('/admin/application');
  
  const adminMenuItems = [
    { text: 'Panel', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Rezervasyonlar', icon: <EventNoteIcon />, path: '/admin/reservations' },
    { text: 'Yorumlar', icon: <RateReviewIcon />, path: '/admin/reviews' },
    { text: 'Masa Planı', icon: <TableChartIcon />, path: '/admin/table-plan' },
    { text: 'Menü', icon: <RestaurantIcon />, path: '/admin/menu-management' },
    { text: 'Rezervasyon Kuralları', icon: <RuleIcon />, path: '/admin/reservation-rules' },
    { text: 'Promosyonlar', icon: <CampaignIcon />, path: '/admin/promotions' },
    { text: 'Ayarlar', icon: <SettingsIcon />, path: '/admin/business-settings' },
  ];

  const superAdminMenuItems = [
    { text: 'Panel', icon: <SuperAdminIcon />, path: '/admin/super-dashboard' },
    { text: 'Başvurular', icon: <BusinessIcon />, path: '/admin/application-management' },
  ];

  const menuItems = isSuperAdmin ? superAdminMenuItems : adminMenuItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2 }}>
        <LogoIcon>L</LogoIcon>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          {isSuperAdmin ? 'Super Admin' : 'Locaffy'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: '#667eea !important',
                    color: 'white !important',
                    '& .MuiListItemIcon-root': {
                      color: 'white !important',
                    },
                  },
                },
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  '& .MuiListItemText-root': {
                    color: 'inherit',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/*Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: 'grey.800' }}
            >
              <MenuIcon />
            </IconButton>
            
            <ButtonBase
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'grey.800',
                  textDecoration: 'none',
                }}
              >
                {businessName} İşletme Hesabı
              </Typography>
            </ButtonBase>

            <Box /> 
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Sol Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Ana İçerik */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: 0 },
          width: '100%',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
