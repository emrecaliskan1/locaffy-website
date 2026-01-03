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
  Alert,
  Grid
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Person, PersonAdd, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StyledCard, PrimaryButton } from '../components/ui';
import { authService } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm || !formData.phoneNumber) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.register(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDownloadApp = () => {
    // Mobil cihaz kontrolü
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Android
    if (/android/i.test(userAgent)) {
      window.location.href = 'https://play.google.com/store/apps'; // Play Store linki eklenecek
    }
    // iOS
    else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.location.href = 'https://apps.apple.com/'; // App Store linki eklenecek
    }
    // Desktop
    else {
      window.open('https://play.google.com/store/apps', '_blank'); // Play Store linki eklenecek
    }
  };

  // Başarılı kayıt ekranı
  if (success) {
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
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <StyledCard
              variant="about"
              sx={{
                borderRadius: 4,
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                py: 6,
                cursor: 'default'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Box
                    component="svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
                    />
                  </Box>
                </Box>
              </motion.div>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'grey.800'
                }}
              >
                Başarıyla Kayıt Oldunuz!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'grey.600',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Uygulamamızdan hesabınıza giriş yapabilirsiniz.
              </Typography>

              <Stack spacing={2} sx={{ mt: 4 }}>
                <PrimaryButton
                  variant="primary"
                  size="large"
                  onClick={handleDownloadApp}
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                    }
                  }}
                >
                  Uygulamayı İndir
                </PrimaryButton>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'grey.500',
                    mt: 2
                  }}
                >
                  veya {' '}
                  <Box
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: '#ff6b35',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    İşletme Girişi Yap
                  </Box>
                </Typography>
              </Stack>
            </StyledCard>
          </motion.div>
        </Container>
      </Box>
    );
  }

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
                Locaffy'e Katıl
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'grey.600',
                  mb: 3
                }}
              >
                Yeni hesap oluşturun ve sosyal deneyiminizi başlatın
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
                    label="Kullanıcı Adınız"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="Örn: ahmetyilmaz"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'grey.500' }} />
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
                  transition={{ delay: 0.42, duration: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="Telefon Numaranız"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="5XX XXX XX XX"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'grey.500' }} />
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
                  transition={{ delay: 0.45, duration: 0.5 }}
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="Şifre Tekrar"
                    name="passwordConfirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.passwordConfirm}
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
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            sx={{ color: 'grey.500' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  transition={{ delay: 0.55, duration: 0.5 }}
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
                    {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                  </PrimaryButton>
                </motion.div>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" sx={{ color: 'grey.500', px: 2 }}>
                veya
              </Typography>
            </Divider>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: 'grey.600'
                }}
              >
                Zaten hesabınız var mı?{' '}
                <Box
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#ff6b35',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#ff8a50'
                    }
                  }}
                >
                  Giriş Yap
                </Box>
              </Typography>
            </motion.div>
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

export default Register;