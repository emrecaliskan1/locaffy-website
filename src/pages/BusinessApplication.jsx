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
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Send as SendIcon,
  Lock,
} from '@mui/icons-material';
import { businessService } from '../services/businessService';

const businessTypes = [
  'Restoran',
  'Kafe',
  'Bar',
  'Pub',
  'Pastane',
  'Fast Food',
  'Pizzeria',
  'Dönerci',
  'Kebapçı',
  'Diğer'
];

const businessTypeMapping = {
  'Restoran': 'RESTAURANT',
  'Kafe': 'CAFE',
  'Bar': 'BAR',
  'Pub': 'BAR',
  'Pastane': 'CAFE',
  'Fast Food': 'RESTAURANT',
  'Pizzeria': 'RESTAURANT',
  'Dönerci': 'RESTAURANT',
  'Kebapçı': 'RESTAURANT',
  'Diğer': 'RESTAURANT'
};

const cities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
  'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum',
  'Van', 'Batman', 'Elazığ', 'Isparta', 'Trabzon', 'Ordu', 'Samsun', 'Zonguldak',
  'Balıkesir', 'Kahramanmaraş', 'Manisa', 'Sivas', 'Aydın', 'Tekirdağ', 'Denizli'
];

const initialFormData = {
  businessName: '',
  businessType: '',
  ownerName: '',
  taxNumber: '',
  email: '',
  phone: '',
  city: '',
  district: '',
  address: '',
  description: '',
  capacity: '',
  openingHours: '',
  hasDelivery: false,
  hasTakeaway: false,
  hasOutdoorSeating: false,
  hasParking: false,
  hasWifi: false,
  hasLiveMusic: false,
  hasPrivateRooms: false,
  website: '',
  instagram: '',
  facebook: '',
  password: '',
  passwordConfirm: ''
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

  const handleSwitchChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked,
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

    const response = await businessService.submitApplication(backendData);
    setSubmitResponse(response);
    setSubmitSuccess(true);
  };

  const isFormValid = () => {
    return formData.businessName &&
      formData.businessType &&
      formData.ownerName &&
      formData.taxNumber &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.password &&
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
    <Box sx={{ py: 10, background: '#f9fafb' }}>
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
              color: 'grey.800'
            }}
          >
            İşletmenizi Locaffy'ye Katın
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'grey.600',
              mb: 6,
              maxWidth: '48rem',
              mx: 'auto'
            }}
          >
            Restoranınızı, kafenizi veya barınızı dijital dünyaya taşıyın.
            Müşterileriniz kolayca rezervasyon yapabilsin, QR kod ile sipariş versin.
          </Typography>
        </motion.div>

        <Card sx={{ maxWidth: 1000, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Temel Bilgiler */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Temel Bilgiler
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="İşletme Türü"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      required
                      variant="outlined"
                      sx={{ minWidth: 200 }}
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="İşletme Sahibi Adı"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Kapasite"
                      placeholder="50"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kişi</InputAdornment>,
                        startAdornment: <InputAdornment position="start"><PeopleIcon /></InputAdornment>,
                      }}
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
                  <Grid item xs={12} sm={6}>
                    <TextField
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
                  <Grid item xs={12} sm={6}>
                    <TextField
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Şehir"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      variant="outlined"
                      sx={{ minWidth: 200 }}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      placeholder="Kadıköy"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      placeholder="Moda Caddesi No:123 Kadıköy/İstanbul"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LocationIcon /></InputAdornment>,
                      }}
                      variant="outlined"
                    />
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
              {/* İşletme Özellikleri */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  İşletme Özellikleri
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Açılış Saatleri"
                      placeholder="09:00 - 23:00"
                      value={formData.openingHours}
                      onChange={(e) => handleInputChange('openingHours', e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><ScheduleIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      placeholder="https://www.lezzetduragi.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      placeholder="@lezzetduragi"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Facebook"
                      placeholder="lezzetduragi"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İşletme Açıklaması"
                      placeholder="İşletmeniz hakkında kısa bir açıklama yazın..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Hizmetler */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Sunulan Hizmetler
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasDelivery}
                          onChange={(e) => handleSwitchChange('hasDelivery', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Teslimat"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasTakeaway}
                          onChange={(e) => handleSwitchChange('hasTakeaway', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Paket Servis"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasOutdoorSeating}
                          onChange={(e) => handleSwitchChange('hasOutdoorSeating', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Açık Hava Oturma"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasParking}
                          onChange={(e) => handleSwitchChange('hasParking', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Otopark"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasWifi}
                          onChange={(e) => handleSwitchChange('hasWifi', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Ücretsiz WiFi"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasLiveMusic}
                          onChange={(e) => handleSwitchChange('hasLiveMusic', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Canlı Müzik"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasPrivateRooms}
                          onChange={(e) => handleSwitchChange('hasPrivateRooms', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Özel Salon"
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
