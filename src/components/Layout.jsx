import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, mt: '80px' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;