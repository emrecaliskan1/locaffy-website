import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  Restore as RestoreIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Rule as RuleIcon,
} from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const initialRules = {
  lateCancellationMinutes: 15,
  depositDeductionPercentage: 20,
  maxPersonCount: 20,
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSave = () => {
    // TODO: API call to save rules
    console.log('Saving rules:', rules);
    setHasChanges(false);
    setSuccessMessage('Rezervasyon kuralları başarıyla kaydedildi!');
    setTimeout(() => setSuccessMessage(''), 3000);
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
            disabled={!hasChanges}
          >
            Sıfırla
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Kaydet
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
              label="Maksimum Kişi Sayısı"
              type="number"
              value={rules.maxPersonCount}
              onChange={(e) => handleInputChange('maxPersonCount', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">kişi</InputAdornment>,
              }}
              inputProps={{ min: 1, max: 50 }}
              helperText="Tek bir rezervasyonda kabul edilecek maksimum kişi sayısı"
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
                        {rules.maxPersonCount} kişi
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

