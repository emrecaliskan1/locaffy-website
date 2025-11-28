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

function ReservationManagementView() {
  const [searchParams] = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    cancelled: 0 
  });

  // PlaceId'yi yükle - Backend'den /api/business/places endpoint'ini kullan
  useEffect(() => {
    const loadPlaceId = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        // Backend'den kullanıcının place'lerini getir
        const places = await reservationService.getMyPlaces();
        
        if (places && Array.isArray(places) && places.length > 0) {
          // İlk place'i kullan (ileride kullanıcı seçim yapabilir)
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
      setReservations(data);
      
      // İstatistikleri hesapla
      const statsData = {
        total: data.length,
        pending: data.filter(r => r.status === 'PENDING').length,
        approved: data.filter(r => r.status === 'APPROVED').length,
        rejected: data.filter(r => r.status === 'REJECTED').length,
        cancelled: data.filter(r => r.status === 'CANCELLED').length,
      };
      setStats(statsData);
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // URL parametresinden reservationId varsa modal aç
  useEffect(() => {
    const reservationId = searchParams.get('reservationId');
    if (reservationId && reservations.length > 0) {
      const targetReservation = reservations.find(r => r.id.toString() === reservationId);
      if (targetReservation) {
        handleViewDetails(targetReservation);
        // URL'den parametreyi temizle
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
      await reservationService.approveReservation(selectedReservation.id);

      setApprovalDialogOpen(false);
      setSelectedReservation(null);
      setSuccessMessage('Rezervasyon başarıyla onaylandı!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Listeyi yenile
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

      // Listeyi yenile
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

      // Listeyi yenile
      setTimeout(() => {
        loadReservations();
      }, 500);
    } catch (error) {
      setErrorMessage(error.message || 'Rezervasyon iptal edilirken bir hata oluştu');
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
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventNoteIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Rezervasyon
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bekleyen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onaylanan
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reddedilen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                İptal Edilen
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
                        {(reservation.status === 'APPROVED' || reservation.status === 'PENDING') && (
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
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Rezervasyon Detayları</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Müşteri Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedReservation.userName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Müşteri ID:
                      </Typography>
                      <Typography variant="body1">{selectedReservation.userId}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Rezervasyon Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        {formatDate(selectedReservation.reservationTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        {selectedReservation.numberOfPeople} kişi
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Durum:
                      </Typography>
                      <Chip
                        label={getStatusLabel(selectedReservation.status)}
                        color={getStatusColor(selectedReservation.status)}
                        size="small"
                      />
                    </Box>
                    {selectedReservation.rejectionReason && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          Red Sebebi:
                        </Typography>
                        <Typography variant="body2" color="error">
                          {selectedReservation.rejectionReason}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
                {selectedReservation.note && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <NoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Not
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedReservation.note}
                      </Typography>
                    </Card>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Zaman Bilgileri
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Oluşturulma:</strong> {formatDate(selectedReservation.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Son Güncelleme:</strong> {formatDate(selectedReservation.updatedAt)}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
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
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)}>
        <DialogTitle>Rezervasyonu Onayla</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedReservation?.userName}</strong> tarafından yapılan rezervasyonu onaylamak istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Rezervasyon Tarihi: <strong>{formatDate(selectedReservation?.reservationTime)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kişi Sayısı: <strong>{selectedReservation?.numberOfPeople}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)} disabled={loading}>
            İptal
          </Button>
          <Button onClick={confirmApproval} variant="contained" color="success" disabled={loading}>
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Red Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rezervasyonu Reddet</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)} disabled={loading}>
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
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Rezervasyonu İptal Et</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={loading}>
            İptal
          </Button>
          <Button onClick={confirmCancel} variant="contained" color="default" disabled={loading}>
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReservationManagementView;

