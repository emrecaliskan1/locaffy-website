import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Restaurant as RestaurantIcon,
  Send as SendIcon,
  Lock,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { LocationPicker, HeroSection } from '../components/ui';
import { businessService } from '../services/businessService';

const businessTypes = [
  'Kafe',
  'Restoran', 
  'Bar',
  'Bistro'
];

const businessTypeMapping = {
  'Kafe': 'CAFE',
  'Restoran': 'RESTAURANT',
  'Bar': 'BAR',
  'Bistro': 'BISTRO'
};

const weekDays = [
  { value: 'MONDAY', label: 'Pazartesi' },
  { value: 'TUESDAY', label: 'Salı' },
  { value: 'WEDNESDAY', label: 'Çarşamba' },
  { value: 'THURSDAY', label: 'Perşembe' },
  { value: 'FRIDAY', label: 'Cuma' },
  { value: 'SATURDAY', label: 'Cumartesi' },
  { value: 'SUNDAY', label: 'Pazar' },
];

const initialFormData = {
  businessName: '',
  businessType: '',
  ownerName: '',
  taxNumber: '',
  email: '',
  phone: '',
  address: '',
  location: null,
  description: '',
  password: '',
  passwordConfirm: '',
  openingTime: '09:00',
  closingTime: '23:00',
  workingDays: []
};

function BusinessApplication() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResponse, setSubmitResponse] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const backendData = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        description: formData.description || null,
        taxNumber: formData.taxNumber,
        businessType: businessTypeMapping[formData.businessType] || 'RESTAURANT',
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        latitude: formData.location?.lat || 41.0082,
        longitude: formData.location?.lng || 28.9784,
        openingTime: formData.openingTime || '09:00',
        closingTime: formData.closingTime || '23:00',
        workingDays: formData.workingDays.length > 0 ? formData.workingDays : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      };

      const response = await businessService.submitApplication(backendData);
      setSubmitResponse(response);
      setSubmitSuccess(true);
      setFormData(initialFormData);

      console.log('Başvuru başarıyla gönderildi:', response);

    } catch (error) {
      setSubmitError(error.message || 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.businessName &&
      formData.businessType &&
      formData.ownerName &&
      formData.taxNumber &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.location &&
      formData.password &&
      formData.passwordConfirm &&
      formData.password === formData.passwordConfirm &&
      formData.password.length >= 6 &&
      formData.openingTime &&
      formData.closingTime &&
      formData.workingDays.length > 0;
  };

  const handleWorkingDayToggle = (day) => {
    setFormData(prev => {
      const currentDays = prev.workingDays || [];
      if (currentDays.includes(day)) {
        return {
          ...prev,
          workingDays: currentDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          workingDays: [...currentDays, day]
        };
      }
    });
  };

  if (submitSuccess) {
      formData.passwordConfirm &&
      formData.password === formData.passwordConfirm &&
      formData.password.length >= 6;
  };

  if (submitSuccess) {
    return (
      <Box sx={{ py: 10, background: '#f9fafb' }}>
        <Container maxWidth="md">
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CardContent>
              <BusinessIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                Başvurunuz Başarıyla Gönderildi!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                İşletme başvurunuz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Başvuru ID'niz: <strong>#{submitResponse?.id || 'Yükleniyor...'}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                Durum: <strong>PENDING</strong> (İnceleniyor)
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData(initialFormData);
                }}
              >
                Yeni Başvuru Yap
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <HeroSection variant="compact">
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
                color: 'white'
              }}
            >
              İşletmenizi Locaffy'ye Katın
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 2,
                maxWidth: '48rem',
                mx: 'auto'
              }}
            >
              Restoranınızı, kafenizi veya barınızı dijital dünyaya taşıyın. 
              Müşterileriniz kolayca rezervasyon yapabilsin, QR kod ile sipariş versin.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      <Box sx={{ py: 6, background: '#f9fafb' }}>
        <Container maxWidth="lg">

        <Card sx={{ maxWidth: 700, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Temel Bilgiler */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Temel Bilgiler
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={10} xy={10}>
                    <TextField
                      sx={{width:300}}
                      fullWidth
                      label="İşletme Adı"
                      placeholder="Örn: Lezzet Durağı Restoran"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><RestaurantIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>

                   <Grid item xs={12}>
                    <TextField
                      sx = {{width:250}}
                      fullWidth
                      label="İşletme Sahibi Adı"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      sx = {{width:250}}
                      fullWidth
                      select
                      label="İşletme Türü"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      required
                      variant="outlined"
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                 
                  <Grid item xs={12}>
                    <TextField
                      sx={{width:250, marginLeft:6.25}}
                      fullWidth
                      label="Vergi Numarası"
                      placeholder="1234567890"
                      value={formData.taxNumber}
                      onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                      required
                      inputProps={{ maxLength: 10 }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* İletişim Bilgileri */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  İletişim Bilgileri
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      sx={{width:300}}
                      fullWidth
                      label="Email"
                      placeholder="info@lezzetduragi.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      sx={{width:300}}
                      fullWidth
                      label="Telefon"
                      placeholder="+90 212 555 0123"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      sx={{width:625}}
                      fullWidth
                      label="Adres"
                      placeholder="Moda Caddesi No:123 Kadıköy/İstanbul"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      multiline
                      rows={1}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LocationIcon /></InputAdornment>,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item sx={{width:300}}>
                    <LocationPicker
                      sx={{width:500}}
                      value={formData.location}
                      onChange={(location) => handleInputChange('location', location)}
                      label="İşletme Konumu *"
                      required
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', width:625 }}>
                      Harita üzerinde işletmenizin tam konumunu seçin. Bu bilgi müşterilerin sizi bulmasına yardımcı olacak.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Çalışma Saatleri ve Günleri */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Çalışma Saatleri ve Günleri
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Açılış Saati"
                      type="time"
                      value={formData.openingTime}
                      onChange={(e) => handleInputChange('openingTime', e.target.value)}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 dakika adımlar
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Kapanış Saati"
                      type="time"
                      value={formData.closingTime}
                      onChange={(e) => handleInputChange('closingTime', e.target.value)}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 dakika adımlar
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Çalışma Günleri *
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {weekDays.map((day) => (
                        <Button
                          key={day.value}
                          variant={formData.workingDays.includes(day.value) ? 'contained' : 'outlined'}
                          onClick={() => handleWorkingDayToggle(day.value)}
                          sx={{
                            minWidth: 100,
                            textTransform: 'none',
                          }}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      İşletmenizin çalıştığı günleri seçin. En az bir gün seçilmelidir.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Şifre Bilgileri */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <Lock sx={{ mr: 1, color: 'primary.main' }} />
                  Şifre Bilgileri
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Şifre"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      variant="outlined"
                      helperText="En az 6 karakter olmalıdır"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Şifre Tekrar"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                      required
                      variant="outlined"
                      helperText="Şifre ile eşleşmeli"
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* İşletme Açıklaması */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  İşletme Açıklaması
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      sx={{width:625}}
                      fullWidth
                      label="İşletme Açıklaması"
                      placeholder="İşletmeniz hakkında kısa bir açıklama yazın... (Opsiyonel)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>

              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={!isFormValid() || isSubmitting}
                  sx={{ px: 6, py: 1.5 }}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        </Container>
      </Box>
    </>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default BusinessApplication;
