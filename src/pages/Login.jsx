import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  Divider,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Restaurant } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StyledCard, PrimaryButton } from '../components/ui';
import { authService } from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      // Kullanıcının role'ünü kontrol et
      const user = authService.getCurrentUser();
      
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
            userRole = decoded.role || decoded.authorities?.[0] || decoded.authority;
            console.log('Token\'dan decode edilen role:', userRole);
            console.log('Decoded token:', decoded);
          } catch (e) {
            console.error('Token decode hatası:', e);
          }
        }
      }

      console.log('Login response:', response);
      console.log('Current user:', user);
      console.log('User role:', userRole);

      // Role'e göre yönlendirme yap
      // Veritabanındaki roller: ROLE_ADMIN, ROLE_USER, ROLE_BUSINESS_OWNER
      
      // Super Admin kontrolü
      if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
        console.log('Super Admin olarak yönlendiriliyor');
        navigate('/admin/super-dashboard');
      } 
      // İşletme sahibi kontrolü (veritabanında ROLE_BUSINESS_OWNER)
      else if (userRole === 'ROLE_BUSINESS_OWNER') {
        console.log('İşletme sahibi (ROLE_BUSINESS_OWNER) olarak yönlendiriliyor');
        navigate('/admin/dashboard');
      } 
      // Diğer olası işletme sahibi rolleri (geriye dönük uyumluluk için)
      else if (
        userRole === 'ROLE_MANAGER' || 
        userRole === 'MANAGER' || 
        userRole === 'BUSINESS_OWNER' ||
        userRole === 'ROLE_BUSINESS' ||
        userRole === 'BUSINESS'
      ) {
        console.log('İşletme sahibi (alternatif role) olarak yönlendiriliyor');
        navigate('/admin/dashboard');
      } 
      // Normal kullanıcı (ROLE_USER) için ana sayfaya yönlendir
      else if (userRole === 'ROLE_USER' || userRole === 'USER') {
        console.log('Normal kullanıcı (ROLE_USER) olarak ana sayfaya yönlendiriliyor');
        navigate('/');
      }
      // Eğer role belirlenemezse, token varsa admin dashboard'a yönlendir (işletme sahibi olabilir)
      else if (localStorage.getItem('accessToken')) {
        console.log('Role belirlenemedi, token mevcut - admin dashboard\'a yönlendiriliyor');
        navigate('/admin/dashboard');
      } 
      // Diğer durumlar için ana sayfaya yönlendir
      else {
        console.log('Bilinmeyen role veya token yok - ana sayfaya yönlendiriliyor');
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Giriş işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        pt: 12,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '10%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          bottom: '15%',
          right: '15%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StyledCard
            variant="about"
            sx={{
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'default'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/locaffy%20icon.png"
                  alt="Locaffy Icon"
                  sx={{
                    width: 80,
                    height: 110,
                    margin: '0 auto 20px',
                    display: 'block',
                    objectFit: 'contain'
                  }}
                />
              </motion.div>
              
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: 'grey.800'
                }}
              >
                İşletme Yöneticisi Girişi
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'grey.600',
                  mb: 3
                }}
              >
                İşletmenizin yönetim paneline giriş yapın
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="E-posta Adresiniz"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#ff8a50',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="Şifreniz"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'grey.500' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#ff8a50',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    variant="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </PrimaryButton>
                </motion.div>
              </Stack>
            </Box>

          </StyledCard>
        </motion.div>
      </Container>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
}

export default Login;