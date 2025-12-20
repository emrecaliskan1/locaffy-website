import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import { AdminPanelSettings as AdminPanelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function SuperAdminAuth() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password
      });

      console.log('Login response:', response);

      // Kullanıcının Super Admin (ROLE_ADMIN) olup olmadığını kontrol et
      const user = authService.getCurrentUser();
      console.log('Current user:', user);
      
      // Eğer user'da role yoksa, token'dan decode et
      let userRole = user?.role;
      if (!userRole) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log('Decoded token:', decoded);
            userRole = decoded.role || decoded.authorities?.[0] || decoded.authority;
            console.log('User role from token:', userRole);
          } catch (e) {
            console.error('Token decode hatası:', e);
          }
        }
      }
      
      console.log('Final userRole:', userRole);
      console.log('Is ROLE_ADMIN?', userRole === 'ROLE_ADMIN');
      console.log('Is ADMIN?', userRole === 'ADMIN');
      
      if (!user || (userRole !== 'ROLE_ADMIN' && userRole !== 'ADMIN')) {
        console.log('Access denied - not Super Admin');
        await authService.logout();
        setError(`Bu sayfaya erişim için Super Admin yetkisi gereklidir. Mevcut rol: ${userRole || 'bulunamadı'}`);
        setLoading(false);
        return;
      }
      console.log('Access granted - redirecting to dashboard');
      navigate('/admin/super-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Giriş işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <AdminPanelIcon
              sx={{
                fontSize: 60,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Super Admin Girişi
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Locaffy Super Admin Paneline Hoş Geldiniz
            </Typography>
          </Box>

          <Card sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Adresi"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  fullWidth
                  label="Şifre"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  autoComplete="current-password"
                />
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Super Admin hesabınızla giriş yapın
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SuperAdminAuth;
