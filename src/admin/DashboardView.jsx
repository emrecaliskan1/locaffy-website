import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { reservationService } from '../services/reservationService';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'COMPLETED':
      return 'info';
    case 'NO_SHOW':
      return 'default';
    case 'REJECTED':
      return 'error';
    case 'CANCELLED':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Beklemede';
    case 'APPROVED':
      return 'Onaylandı';
    case 'COMPLETED':
      return 'Tamamlandı';
    case 'NO_SHOW':
      return 'Gelmedi';
    case 'REJECTED':
      return 'Reddedildi';
    case 'CANCELLED':
      return 'İptal Edildi';
    default:
      return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};



// Mock data - gerçek uygulamada API'den gelecek
const mockStats = {
  monthlyReservations: 1247,
  occupancyRate: 78.5,
  cancellationCount: 23,
  estimatedRevenue: 45680,
  groupReservations: 89,
  averageWaitTime: 12,
};

const StatCard = ({ title, value, icon, color = 'primary', subtitle, disabled = false }) => (
  <Card sx={{ height: '100%', opacity: disabled ? 0.6 : 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

function DashboardView() {
  const navigate = useNavigate();
  const [placeId, setPlaceId] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [placeMainImageUrl, setPlaceMainImageUrl] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadPlaceId = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const places = await reservationService.getMyPlaces();

        if (places && Array.isArray(places) && places.length > 0) {
          const firstPlace = places[0];
          const placeId = firstPlace.id;
          const placeName = firstPlace.name || firstPlace.placeName || '';
          // Backend'den mainImageUrl dönüyor (banner ve logo aynı alanı kullanıyor)
          const mainImageUrl = firstPlace.mainImageUrl || null;

          setPlaceId(placeId);
          if (placeName) {
            setPlaceName(placeName);
          }
          setPlaceMainImageUrl(mainImageUrl);
        } else {
          setErrorMessage('Hiç işletme bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.');
        }
      } catch (error) {
        setErrorMessage(error.message || 'İşletme bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    loadPlaceId();
  }, []);

  useEffect(() => {
    if (placeId) {
      loadReservations();
    }
  }, [placeId]);

  const loadReservations = async () => {
    if (!placeId) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await reservationService.getPlaceReservations(placeId);
      
      // Tarihi geçmiş ve hala PENDING olan rezervasyonları otomatik iptal et
      const now = new Date();
      const expiredPendingReservations = data.filter(reservation => {
        if (reservation.status !== 'PENDING') return false;
        
        const reservationTime = new Date(reservation.reservationTime);
        return reservationTime < now; // Rezervasyon tarihi geçmiş
      });

      // Tarihi geçmiş PENDING rezervasyonları iptal et
      if (expiredPendingReservations.length > 0) {
        const cancelPromises = expiredPendingReservations.map(reservation =>
          reservationService.cancelReservation(reservation.id).catch(error => {
            console.error(`Rezervasyon ${reservation.id} iptal edilirken hata:`, error);
            return null; // Hata olsa bile devam et
          })
        );
        
        await Promise.all(cancelPromises);
        
        // Rezervasyonları yeniden yükle
        const updatedData = await reservationService.getPlaceReservations(placeId);
        setAllReservations(updatedData);

        const recent = updatedData
          .sort((a, b) => new Date(b.createdAt || b.reservationTime) - new Date(a.createdAt || a.reservationTime))
          .slice(0, 5);
        setRecentReservations(recent);
      } else {
        setAllReservations(data);

        const recent = data
          .sort((a, b) => new Date(b.createdAt || b.reservationTime) - new Date(a.createdAt || a.reservationTime))
          .slice(0, 5);
        setRecentReservations(recent);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Geçici istatistikler (backend endpoint gelince kaldırılacak)
  const calculateTempStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Bu ayki rezervasyonlar
    const monthlyReservations = allReservations.filter(r => {
      const resDate = new Date(r.createdAt || r.reservationTime);
      return resDate >= startOfMonth;
    });

    // İptal sayısı
    const cancellationCount = monthlyReservations.filter(r => r.status === 'CANCELLED').length;

    // Grup rezervasyonları (8+ kişi)
    const groupReservations = monthlyReservations.filter(r => r.numberOfPeople >= 8).length;

    return {
      monthlyReservations: monthlyReservations.length,
      cancellationCount,
      groupReservations,
    };
  };

  const tempStats = calculateTempStats();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Kontrol Paneli
      </Typography>

      {placeName && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          İşletme: <strong>{placeName}</strong>
        </Typography>
      )}

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

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Aylık Rezervasyon"
            value={tempStats.monthlyReservations.toLocaleString()}
            icon={<RestaurantIcon />}
            color="primary"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Doluluk Oranı"
            value="Yakında"
            icon={<TrendingUpIcon />}
            color="success"
            subtitle="Backend endpoint bekleniyor"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tahmini Gelir"
            value="Yakında"
            icon={<MonetizationOnIcon />}
            color="success"
            subtitle="Backend endpoint bekleniyor"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="İptal Sayısı"
            value={tempStats.cancellationCount}
            icon={<CancelIcon />}
            color="error"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Grup Rezervasyonları"
            value={tempStats.groupReservations}
            icon={<PeopleIcon />}
            color="info"
            subtitle="Bu ay (8+ kişi)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ortalama Bekleme"
            value="Yakında"
            icon={<ScheduleIcon />}
            color="warning"
            subtitle="Backend endpoint bekleniyor"
            disabled={true}
          />
        </Grid>
      </Grid>

      {/* QR Menü Kartı */}
      <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Dijital QR Menünüz
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Müşterilerinizin menünüze hızlıca ulaşması için bu QR kodu masalarınıza yerleştirin.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<QrCodeIcon />}
              onClick={() => placeId ? window.open(`${window.location.origin}/menu/${placeId}`, '_blank') : null}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Menüyü Görüntüle
            </Button>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
            {placeId ? (
              <QRCode
                value={`${window.location.origin}/menu/${placeId}`}
                size={120}
                level="H"
              />
            ) : (
              <Box sx={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>


      {/* Hızlı Eylemler */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hızlı Eylemler
          </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<CheckCircleIcon />}
              disabled={true}
              title="Backend endpoint bekleniyor"
            >
              Toplu Onaylama
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<RestaurantIcon />}
              disabled={true}
              title="Backend endpoint bekleniyor"
            >
              Masa Durumu Güncelle
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<PeopleIcon />}
              disabled={true}
              title="Yakında eklenecek"
            >
              Rezervasyon Ekle
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Rezervasyon Takibi */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Son Rezervasyonlar
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && recentReservations.length === 0 && !errorMessage && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Henüz rezervasyon bulunmamaktadır.
            </Alert>
          )}

          {!loading && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Müşteri</TableCell>
                    <TableCell>Rezervasyon Tarihi</TableCell>
                    <TableCell>Kişi Sayısı</TableCell>
                    <TableCell align="center">Durum</TableCell>
                    <TableCell align="center">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{reservation.userName}</TableCell>
                      <TableCell>{formatDate(reservation.reservationTime)}</TableCell>
                      <TableCell>{reservation.numberOfPeople} kişi</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusLabel(reservation.status)}
                          color={getStatusColor(reservation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {reservation.status === 'PENDING' ? (
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<ScheduleIcon />}
                            onClick={() => {
                              navigate(`/admin/reservations?reservationId=${reservation.id}`);
                            }}
                          >
                            Rezervasyon Detayı
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardView;