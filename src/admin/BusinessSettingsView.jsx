import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { reservationService } from '../services/reservationService';
import PlaceLogoUpload from '../components/PlaceLogoUpload';

const weekDays = [
  { value: 'PAZARTESİ', label: 'Pazartesi' },
  { value: 'SALI', label: 'Salı' },
  { value: 'ÇARŞAMBA', label: 'Çarşamba' },
  { value: 'PERŞEMBE', label: 'Perşembe' },
  { value: 'CUMA', label: 'Cuma' },
  { value: 'CUMARTESİ', label: 'Cumartesi' },
  { value: 'PAZAR', label: 'Pazar' },
];

function BusinessSettingsView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [placeId, setPlaceId] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [placeMainImageUrl, setPlaceMainImageUrl] = useState(null);
  const [settings, setSettings] = useState({
    openingTime: '09:00',
    closingTime: '23:00',
    workingDays: []
  });

  useEffect(() => {
    loadPlaceInfo();
    loadSettings();
  }, []);

  const loadPlaceInfo = async () => {
    try {
      const places = await reservationService.getMyPlaces();
      if (places && Array.isArray(places) && places.length > 0) {
        const firstPlace = places[0];
        setPlaceId(firstPlace.id);
        setPlaceName(firstPlace.name || firstPlace.placeName || '');
        setPlaceMainImageUrl(firstPlace.mainImageUrl || null);
      }
    } catch (error) {
      console.error('İşletme bilgileri yüklenirken hata:', error);
    }
  };

  const loadSettings = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await adminService.getBusinessSettings();
      setSettings({
        openingTime: data.openingTime || '09:00',
        closingTime: data.closingTime || '23:00',
        workingDays: data.workingDays || ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA']
      });
    } catch (error) {
      setErrorMessage(error.message || 'Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingDayToggle = (day) => {
    setSettings(prev => {
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

  const handleSave = async () => {
    if (settings.workingDays.length === 0) {
      setErrorMessage('En az bir çalışma günü seçmelisiniz');
      return;
    }

    if (!settings.openingTime || !settings.closingTime) {
      setErrorMessage('Açılış ve kapanış saatleri belirtilmelidir');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await adminService.updateBusinessSettings(settings);
      setSuccessMessage('Ayarlar başarıyla kaydedildi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        İşletme Ayarları
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Card>
        <CardContent>
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
                  value={settings.openingTime}
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
                  value={settings.closingTime}
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
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Çalışma Günleri *
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {weekDays.map((day) => (
                    <Button
                      key={day.value}
                      variant={settings.workingDays.includes(day.value) ? 'contained' : 'outlined'}
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={loadSettings}
              disabled={saving}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || settings.workingDays.length === 0}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* İşletme Logosu */}
      {placeId && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                İşletme Logosu
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {placeName && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  İşletme ID: <strong>{placeId}</strong> - {placeName}
                </Typography>
              )}
            </Box>
            <PlaceLogoUpload
              placeId={placeId}
              currentMainImageUrl={placeMainImageUrl}
              onLogoUpdate={(newMainImageUrl) => {
                setPlaceMainImageUrl(newMainImageUrl);
                setSuccessMessage('Logo başarıyla güncellendi!');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default BusinessSettingsView;

