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
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: 'primary.light',
              color: 'primary.main',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
            />
            
            <TextField
              fullWidth
              label="Depozito Kesintisi Yüzdesi"
              type="number"
              value={rules.depositDeductionPercentage}
              onChange={(e) => handleInputChange('depositDeductionPercentage', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={rules.autoConfirmReservations}
                  onChange={(e) => handleSwitchChange('autoConfirmReservations', e.target.checked)}
                  color="primary"
                />
              }
              label="Rezervasyonları Otomatik Onayla"
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
            />

            <TextField
              fullWidth
              label="Önceden Rezervasyon Günü"
              type="number"
              value={rules.advanceBookingDays}
              onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">gün</InputAdornment>,
              }}
              inputProps={{ min: 1, max: 365 }}
            />

            <TextField
              fullWidth
              label="Minimum Rezervasyon Saati"
              type="number"
              value={rules.minBookingHours}
              onChange={(e) => handleInputChange('minBookingHours', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">saat</InputAdornment>,
              }}
              inputProps={{ min: 1, max: 24 }}
            />
          </RuleCard>
        </Grid>

        {/* Grup Rezervasyon Kuralları */}
        <Grid item xs={12} md={6}>
          <RuleCard title="Grup Rezervasyon Kuralları" icon={<PeopleIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={rules.allowGroupReservations}
                  onChange={(e) => handleSwitchChange('allowGroupReservations', e.target.checked)}
                  color="primary"
                />
              }
              label="Grup Rezervasyonlarına İzin Ver"
            />

            <TextField
              fullWidth
              label="Maksimum Grup Büyüklüğü"
              type="number"
              value={rules.maxGroupSize}
              onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">kişi</InputAdornment>,
              }}
              inputProps={{ min: 2, max: 50 }}
              disabled={!rules.allowGroupReservations}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={rules.requireDepositForGroups}
                  onChange={(e) => handleSwitchChange('requireDepositForGroups', e.target.checked)}
                  color="primary"
                />
              }
              label="Grup Rezervasyonları İçin Depozito Gerekli"
              disabled={!rules.allowGroupReservations}
            />

            <TextField
              fullWidth
              label="Grup Depozito Yüzdesi"
              type="number"
              value={rules.groupDepositPercentage}
              onChange={(e) => handleInputChange('groupDepositPercentage', parseInt(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100 }}
              disabled={!rules.requireDepositForGroups || !rules.allowGroupReservations}
            />
          </RuleCard>
        </Grid>

        {/* Politika Metinleri */}
        <Grid item xs={12} md={6}>
          <RuleCard title="Politika Metinleri" icon={<RuleIcon />}>
            <TextField
              fullWidth
              label="İptal Politikası"
              value={rules.cancellationPolicy}
              onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Gecikme Politikası"
              value={rules.lateArrivalPolicy}
              onChange={(e) => handleInputChange('lateArrivalPolicy', e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Grup Rezervasyon Politikası"
              value={rules.groupBookingPolicy}
              onChange={(e) => handleInputChange('groupBookingPolicy', e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </RuleCard>
        </Grid>

        {/* Özet Bilgiler */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Mevcut Kurallar Özeti
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {rules.lateCancellationMinutes} dk
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gecikme İptali
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      %{rules.depositDeductionPercentage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Depozito Kesintisi
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {rules.maxPersonCount} kişi
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Maksimum Kapasite
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {rules.advanceBookingDays} gün
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Önceden Rezervasyon
                    </Typography>
                  </Paper>
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

