import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  Note as NoteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { reservationService, ReservationStatus } from '../services/reservationService';
import { authService } from '../services/authService';
import api from '../services/api';
import { useLocation, useSearchParams } from 'react-router-dom';

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
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
  } catch (error) {
    return dateString;
  }
};

// Rezervasyon saati geçti mi kontrol et
const isReservationTimePassed = (reservationTime) => {
  if (!reservationTime) return false;
  const now = new Date();
  const resTime = new Date(reservationTime);
  return resTime <= now;
};

// NO_SHOW için 2 saatlik zaman penceresinde mi kontrol et
const isWithinTwoHourWindow = (reservationTime) => {
  if (!reservationTime) return false;
  const now = new Date();
  const resTime = new Date(reservationTime);
  const twoHoursLater = new Date(resTime.getTime() + 2 * 60 * 60 * 1000);
  return now <= twoHoursLater;
};

// Rezervasyonun tamamlanabilir olup olmadığını kontrol et
const canMarkAsCompleted = (reservation) => {
  const validStatuses = ['APPROVED', 'NO_SHOW'];
  if (!validStatuses.includes(reservation.status)) return false;

  if (!isReservationTimePassed(reservation.reservationTime)) return false;

  if (reservation.status === 'NO_SHOW') {
    return isWithinTwoHourWindow(reservation.reservationTime);
  }

  return true;
};

function ReservationManagementView() {
  const [searchParams] = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [tableName, setTableName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    noShow: 0,
    rejected: 0,
    cancelled: 0
  });

  // PlaceId'yi yükle - Backend'den /api/business/places endpoint'ini kullan
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

          console.log('Place\'ler yüklendi:', places);
          console.log('İlk place seçildi:', { id: placeId, name: placeName });

          setPlaceId(placeId);
          if (placeName) {
            setPlaceName(placeName);
          }

          // Eğer birden fazla place varsa, kullanıcıya bilgi ver (ileride dropdown eklenebilir)
          if (places.length > 1) {
            console.log(`${places.length} adet işletme bulundu. İlk işletme seçildi.`);
          }
        } else {
          setErrorMessage('Hiç işletme bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.');
          console.warn('Place listesi boş veya geçersiz:', places);
        }
      } catch (error) {
        console.error('Place\'ler yüklenirken hata:', error);
        setErrorMessage(error.message || 'İşletme bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadPlaceId();
  }, []);

  // Rezervasyonları yükle
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
        return reservationTime < now;
      });

      // Tarihi geçmiş PENDING rezervasyonları iptal et
      if (expiredPendingReservations.length > 0) {
        const cancelPromises = expiredPendingReservations.map(reservation =>
          reservationService.cancelReservation(reservation.id).catch(error => {
            console.error(`Rezervasyon ${reservation.id} iptal edilirken hata:`, error);
            return null;
          })
        );

        await Promise.all(cancelPromises);

        const updatedData = await reservationService.getPlaceReservations(placeId);
        const sortedData = updatedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReservations(sortedData);

        // İstatistikleri hesapla
        const statsData = {
          total: updatedData.length,
          pending: updatedData.filter(r => r.status === 'PENDING').length,
          approved: updatedData.filter(r => r.status === 'APPROVED').length,
          completed: updatedData.filter(r => r.status === 'COMPLETED').length,
          noShow: updatedData.filter(r => r.status === 'NO_SHOW').length,
          rejected: updatedData.filter(r => r.status === 'REJECTED').length,
          cancelled: updatedData.filter(r => r.status === 'CANCELLED').length,
        };
        setStats(statsData);
      } else {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReservations(sortedData);

        const statsData = {
          total: data.length,
          pending: data.filter(r => r.status === 'PENDING').length,
          approved: data.filter(r => r.status === 'APPROVED').length,
          completed: data.filter(r => r.status === 'COMPLETED').length,
          noShow: data.filter(r => r.status === 'NO_SHOW').length,
          rejected: data.filter(r => r.status === 'REJECTED').length,
          cancelled: data.filter(r => r.status === 'CANCELLED').length,
        };
        setStats(statsData);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reservationId = searchParams.get('reservationId');
    if (reservationId && reservations.length > 0) {
      const targetReservation = reservations.find(r => r.id.toString() === reservationId);
      if (targetReservation) {
        handleViewDetails(targetReservation);
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('reservationId');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [reservations, searchParams]);

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
  };

  const handleApprove = (reservation) => {
    setSelectedReservation(reservation);
    setApprovalDialogOpen(true);
  };

  const handleReject = (reservation) => {
    setSelectedReservation(reservation);
    setRejectionDialogOpen(true);
  };

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  const confirmApproval = async () => {
    if (!selectedReservation) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await reservationService.approveReservation(selectedReservation.id, tableName.trim() || null);

      setApprovalDialogOpen(false);
      setSelectedReservation(null);
      setTableName('');
      setSuccessMessage('Rezervasyon başarıyla onaylandı!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setTimeout(() => {
        loadReservations();
      }, 500);
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyon onaylanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedReservation || !rejectionReason.trim()) {
      setErrorMessage('Red sebebi gereklidir');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await reservationService.rejectReservation(
        selectedReservation.id,
        rejectionReason
      );

      setRejectionDialogOpen(false);
      setSelectedReservation(null);
      setRejectionReason('');
      setSuccessMessage('Rezervasyon reddedildi!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setTimeout(() => {
        loadReservations();
      }, 500);
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyon reddedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = async () => {
    if (!selectedReservation) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await reservationService.cancelReservation(selectedReservation.id);

      setCancelDialogOpen(false);
      setSelectedReservation(null);
      setSuccessMessage('Rezervasyon iptal edildi!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() => {
        loadReservations();
      }, 500);
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyon iptal edilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (reservationId) => {
    setLoading(true);
    setErrorMessage('');

    try {
      await reservationService.completeReservation(reservationId);

      setSuccessMessage('✓ Rezervasyon gerçekleşti olarak işaretlendi');
      setTimeout(() => setSuccessMessage(''), 3000);

      setTimeout(() => {
        loadReservations();
      }, 500);
    } catch (error) {
      // 422 Validation hatasını özel olarak yakala
      if (error.response?.status === 422) {
        const errorMsg = error.response?.data?.message ||
          "Rezervasyon saatinden çok fazla zaman geçtiği için 'Geç Geldi' işlemi yapılamaz.";
        setErrorMessage(errorMsg);
        console.error('Rezervasyon tamamlama validation hatası:', error.response?.data);
      } else {
        // Diğer hatalar
        const errorMsg = error.message || 'İşlem sırasında bir hata oluştu';
        setErrorMessage(errorMsg);
        console.error('Rezervasyon tamamlama hatası:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Rezervasyon Yönetimi
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

      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Box sx={{ color: 'primary.main', fontSize: '1.5rem' }}>
                  <EventNoteIcon />
                </Box>
              </Box>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Toplam
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Bekleyen
              </Typography>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'warning.main'
              }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Onay bekliyor
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Onaylı
              </Typography>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'success.main'
              }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Onaylanmış
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Tamamlandı
              </Typography>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'info.main'
              }}>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Bitti
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Gelmedi
              </Typography>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'text.disabled'
              }}>
                {stats.noShow}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                No-show
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minWidth: '150px'
          }}>
            <CardContent sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px !important',
              textAlign: 'center'
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                İptal
              </Typography>
              <Typography variant="h3" component="div" sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                İptal edilmiş
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rezervasyon Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Rezervasyonlar
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && reservations.length === 0 && !errorMessage && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Henüz rezervasyon bulunmamaktadır.
            </Alert>
          )}

          {!loading && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Müşteri Adı</TableCell>
                    <TableCell>Rezervasyon Tarihi</TableCell>
                    <TableCell>Kişi Sayısı</TableCell>
                    <TableCell>Not</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{reservation.userName}</TableCell>
                      <TableCell>{formatDate(reservation.reservationTime)}</TableCell>
                      <TableCell>{reservation.numberOfPeople} kişi</TableCell>
                      <TableCell>
                        {reservation.note ? (
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {reservation.note}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(reservation.status)}
                          color={getStatusColor(reservation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(reservation)}
                          title="Detayları Görüntüle"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {reservation.status === 'PENDING' && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApprove(reservation)}
                              title="Onayla"
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleReject(reservation)}
                              title="Reddet"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        {(reservation.status === 'APPROVED' || reservation.status === 'NO_SHOW') && (
                          <Button
                            size="small"
                            variant="outlined"
                            color={reservation.status === 'NO_SHOW' ? 'warning' : 'info'}
                            onClick={() => handleComplete(reservation.id)}
                            disabled={!canMarkAsCompleted(reservation)}
                            sx={{
                              mr: 1,
                              minWidth: 'auto',
                              px: 1,
                              opacity: !canMarkAsCompleted(reservation) ? 0.5 : 1,
                              '&.Mui-disabled': {
                                borderColor: reservation.status === 'NO_SHOW' ? 'warning.main' : 'info.main',
                                color: reservation.status === 'NO_SHOW' ? 'warning.main' : 'info.main',
                                opacity: 0.4
                              }
                            }}
                            title={
                              !isReservationTimePassed(reservation.reservationTime)
                                ? `Rezervasyon saati: ${formatDate(reservation.reservationTime)}`
                                : reservation.status === 'NO_SHOW' && !isWithinTwoHourWindow(reservation.reservationTime)
                                  ? 'Rezervasyon saatinden çok fazla zaman geçtiği için işlem yapılamaz'
                                  : reservation.status === 'NO_SHOW'
                                    ? 'Müşteri Geç Geldi (Gerçekleşti Yap)'
                                    : 'Gerçekleşti Olarak İşaretle'
                            }
                          >
                            {reservation.status === 'NO_SHOW' ? '⏰ Geç Geldi' : '✓ Gerçekleşti'}
                          </Button>
                        )}
                        {(reservation.status === 'PENDING' || reservation.status === 'APPROVED') && (
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleCancel(reservation)}
                            title="İptal Et"
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
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

      {/* Rezervasyon Detay Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          Rezervasyon Detayları
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          {selectedReservation && (
            <Box>
              {/* Müşteri Bilgileri - En Üstte */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '18px' }} />
                  <strong>Müşteri:</strong> {selectedReservation.userName}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                  <strong>Müşteri ID:</strong> {selectedReservation.userId}
                </Typography>
                {selectedReservation.userPhoneNumber && (
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                    <strong>Telefon:</strong> {selectedReservation.userPhoneNumber}
                  </Typography>
                )}
              </Box>

              {/* Rezervasyon Bilgileri */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Rezervasyon Bilgileri
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(selectedReservation.reservationTime)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {selectedReservation.numberOfPeople} kişi
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
                      Durum:
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedReservation.status)}
                      color={getStatusColor(selectedReservation.status)}
                      size="medium"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  {selectedReservation.rejectionReason && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Red Sebebi:
                      </Typography>
                      <Typography variant="body2" color="error">
                        {selectedReservation.rejectionReason}
                      </Typography>
                    </Box>
                  )}
                  {selectedReservation.status === 'APPROVED' && selectedReservation.tableName && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                        🍽️ Masa: {selectedReservation.tableName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Not Bilgisi */}
              {selectedReservation.note && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    <NoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Not
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '16px',
                      lineHeight: 1.6
                    }}
                  >
                    {selectedReservation.note}
                  </Typography>
                </Box>
              )}

              {/* Zaman Bilgileri - En Altta */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Oluşturulma
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatDate(selectedReservation.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Son Güncelleme
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatDate(selectedReservation.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            variant="outlined"
          >
            Kapat
          </Button>
          {selectedReservation?.status === 'PENDING' && (
            <>
              <Button
                onClick={() => {
                  setDetailDialogOpen(false);
                  handleApprove(selectedReservation);
                }}
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Onayla
              </Button>
              <Button
                onClick={() => {
                  setDetailDialogOpen(false);
                  handleReject(selectedReservation);
                }}
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
              >
                Reddet
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Onay Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Rezervasyonu Onayla</DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedReservation?.userName}</strong> tarafından yapılan rezervasyonu onaylamak istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Rezervasyon Tarihi: <strong>{formatDate(selectedReservation?.reservationTime)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kişi Sayısı: <strong>{selectedReservation?.numberOfPeople}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Masa Adı / Numarası (Opsiyonel)"
            placeholder="Örn: Masa 5, Bahçe 3, VIP 1"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            margin="normal"
            variant="outlined"
            helperText="Müşteri onay sonrası bu bilgiyi görecektir"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setApprovalDialogOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            İptal
          </Button>
          <Button
            onClick={confirmApproval}
            variant="contained"
            color="success"
            disabled={loading}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Red Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Rezervasyonu Reddet</DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedReservation?.userName}</strong> tarafından yapılan rezervasyonu reddetmek istediğinizden emin misiniz?
          </Typography>
          <TextField
            fullWidth
            label="Red Sebebi"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Red sebebini açıklayın..."
            required
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setRejectionDialogOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            İptal
          </Button>
          <Button
            onClick={confirmRejection}
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim() || loading}
          >
            Reddet
          </Button>
        </DialogActions>
      </Dialog>

      {/* İptal Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Rezervasyonu İptal Et</DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedReservation?.userName}</strong> tarafından yapılan rezervasyonu iptal etmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Rezervasyon Tarihi: <strong>{formatDate(selectedReservation?.reservationTime)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kişi Sayısı: <strong>{selectedReservation?.numberOfPeople}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            İptal
          </Button>
          <Button
            onClick={confirmCancel}
            variant="contained"
            color="default"
            disabled={loading}
          >
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReservationManagementView;

