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

    // Super admin authentication
    if (credentials.email === 'admin@locaffy.com' && credentials.password === 'admin123') {
      // Store super admin auth token
      localStorage.setItem('superAdminAuth', 'true');
      navigate('/admin/super-dashboard');
    } else {
      setError('Geçersiz email veya şifre');
    }
    
    setLoading(false);
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
              Demo Giriş Bilgileri:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: admin@locaffy.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Şifre: admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SuperAdminAuth;
