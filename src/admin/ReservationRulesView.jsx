import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Paper,
  InputAdornment,
  Slider,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Restore as RestoreIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Rule as RuleIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';

// Mock data - gerçek uygulamada API'den gelecek
const initialRules = {
  lateCancellationMinutes: 15,
  depositDeductionPercentage: 20,
  reservationCapacity: 10,
  advanceBookingDays: 30,
  minBookingHours: 2,
  autoConfirmReservations: true,
  allowGroupReservations: true,
  requireDepositForGroups: true,
  groupDepositPercentage: 30,
  maxGroupSize: 15,
  cancellationPolicy: 'Rezervasyon iptal edildiğinde depozito kesintisi uygulanır.',
  lateArrivalPolicy: '15 dakika geç kalma durumunda rezervasyon iptal edilir.',
  groupBookingPolicy: '8 kişi ve üzeri rezervasyonlar için depozito gereklidir.',
};

function ReservationRulesView() {
  const [rules, setRules] = useState(initialRules);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBusinessSettings();
      setRules(prev => ({
        ...prev,
        reservationCapacity: data.reservationCapacity || 10,
        lateCancellationMinutes: data.lateCancellationMinutes || 15
      }));
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      setErrorMessage(error.message || 'Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRules(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSwitchChange = (field, checked) => {
    setRules(prev => ({
      ...prev,
      [field]: checked,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await adminService.updateBusinessSettings({
        reservationCapacity: rules.reservationCapacity,
        lateCancellationMinutes: rules.lateCancellationMinutes
      });
      setHasChanges(false);
      setSuccessMessage('Rezervasyon kuralları başarıyla kaydedildi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Kurallar kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRules(initialRules);
    setHasChanges(false);
    setSuccessMessage('Kurallar varsayılan değerlere sıfırlandı!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const RuleCard = ({ title, icon, children }) => (
    <Card sx={{ 
      height: 'auto', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      minHeight: '200px'
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '16px !important'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }}>
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Rezervasyon Kuralları
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleReset}
            disabled={!hasChanges || saving}
          >
            Sıfırla
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Gecikme ve İptal Kuralları */}
        <Grid item xs={12} md={6}>
          <RuleCard title="Gecikme ve İptal Kuralları" icon={<ScheduleIcon />}>
            <TextField
              fullWidth
              label="Gecikme İptali Süresi"
              type="number"
              value={rules.lateCancellationMinutes}
              onChange={(e) => handleInputChange('lateCancellationMinutes', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">dakika</InputAdornment>,
              }}
              inputProps={{ min: 5, max: 60 }}
              helperText="Müşteri kaç dakika sonra gelirse rezervasyon iptal edilecek"
            />
          </RuleCard>
        </Grid>

        {/* Kapasite ve Rezervasyon Kuralları */}
        <Grid item xs={12} md={6}>
          <RuleCard title="Kapasite ve Rezervasyon Kuralları" icon={<PeopleIcon />}>
            <TextField
              fullWidth
              label="Rezervasyon Kapasitesi"
              type="number"
              value={rules.reservationCapacity}
              onChange={(e) => handleInputChange('reservationCapacity', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">rezervasyon</InputAdornment>,
              }}
              inputProps={{ min: 1, max: 100 }}
              helperText="Aynı anda kabul edilebilecek maksimum rezervasyon sayısı"
            />
          </RuleCard>
        </Grid>

        {/* Özet Bilgiler */}
        <Grid item xs={12}>
          <Card sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '16px !important'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Mevcut Kurallar Özeti
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Card sx={{ 
                    height: '120px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}>
                    <CardContent sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '16px !important'
                    }}>
                      <Typography variant="h3" component="div" sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        fontSize: '2rem'
                      }}>
                        {rules.lateCancellationMinutes} dk
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontSize: '0.875rem',
                        opacity: 0.9
                      }}>
                        Gecikme İptali
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Card sx={{ 
                    height: '120px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'success.main',
                    color: 'white'
                  }}>
                    <CardContent sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '16px !important'
                    }}>
                      <Typography variant="h3" component="div" sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        fontSize: '2rem'
                      }}>
                        {rules.reservationCapacity} rez.
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontSize: '0.875rem',
                        opacity: 0.9
                      }}>
                        Maksimum Kapasite
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReservationRulesView;

