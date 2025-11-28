import React, { useState } from 'react';
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
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { businessService } from '../services/businessService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
    case 'Beklemede':
      return 'warning';
    case 'APPROVED':
    case 'Onaylandı':
      return 'success';
    case 'REJECTED':
    case 'Reddedildi':
      return 'error';
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
    default:
      return status;
  }
};

function ApplicationManagementView() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Role kontrolü
  React.useEffect(() => {
    const user = authService.getCurrentUser();
    
    // Eğer user'da role yoksa, token'dan decode et
    let userRole = user?.role;
    if (!userRole) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          userRole = decoded.role || decoded.authorities?.[0];
        } catch (e) {
          console.error('Token decode hatası:', e);
        }
      }
    }
    
    if (!user || (userRole !== 'ROLE_ADMIN' && userRole !== 'ADMIN')) {
      setErrorMessage('Bu sayfaya erişim için Super Admin yetkisi gereklidir.');
      setIsAuthorized(false);
      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleApprove = (application) => {
    setSelectedApplication(application);
    setApprovalDialogOpen(true);
  };

  const handleReject = (application) => {
    setSelectedApplication(application);
    setRejectionDialogOpen(true);
  };

  const confirmApproval = async () => {
    if (!selectedApplication || !isAuthorized) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await businessService.approveApplication(selectedApplication.id);

      setApplications(prev => prev.map(app =>
        app.id === selectedApplication.id
          ? { ...app, status: 'APPROVED', updatedAt: response.updatedAt }
          : app
      ));

      setApprovalDialogOpen(false);
      setSelectedApplication(null);
      setSuccessMessage('Başvuru başarıyla onaylandı! İşletme hesabı oluşturuldu.');
      setTimeout(() => setSuccessMessage(''), 3000);

      loadStats();
      // Başvuru listesini yeniden yükle (loading state'i karıştırmamak için await kullanmıyoruz)
      setTimeout(() => {
        loadApplications();
      }, 500);
    } catch (error) {
      console.error('Approval error details:', {
        error,
        response: error.response,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        message: error.message,
        applicationId: selectedApplication?.id
      });

      // 409 Conflict - Başvuru zaten işleme alınmış
      if (error.message?.includes('zaten işleme alınmış') || error.message?.includes('Sadece bekleyen')) {
        setErrorMessage(error.message);
        // Başvuru listesini yeniden yükle
        setTimeout(() => {
          loadApplications();
        }, 500);
      } else if (error.response?.status === 500) {
        // Backend'den gelen detaylı mesajı göster
        const backendMessage = error.response?.data?.message || 
                              error.response?.data?.error ||
                              error.response?.data?.detail ||
                              error.response?.data?.title ||
                              error.message;
        setErrorMessage(backendMessage || 'Sunucu hatası oluştu. Lütfen backend loglarını kontrol edin.');
      } else {
        setErrorMessage(error.message || 'Başvuru onaylanırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedApplication || !rejectionReason.trim() || !isAuthorized) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await businessService.rejectApplication(
        selectedApplication.id,
        rejectionReason
      );

      setApplications(prev => prev.map(app =>
        app.id === selectedApplication.id
          ? {
            ...app,
            status: 'REJECTED',
            rejectionReason: response.rejectionReason,
            updatedAt: response.updatedAt,
          }
          : app
      ));

      setRejectionDialogOpen(false);
      setSelectedApplication(null);
      setRejectionReason('');
      setSuccessMessage('Başvuru reddedildi!');
      setTimeout(() => setSuccessMessage(''), 3000);

      loadStats();
      // Başvuru listesini yeniden yükle (loading state'i karıştırmamak için await kullanmıyoruz)
      setTimeout(() => {
        loadApplications();
      }, 500);
    } catch (error) {
      // 409 Conflict - Başvuru zaten işleme alınmış
      if (error.message?.includes('zaten işleme alınmış') || error.message?.includes('Sadece bekleyen')) {
        setErrorMessage(error.message);
        // Başvuru listesini yeniden yükle
        setTimeout(() => {
          loadApplications();
        }, 500);
      } else if (error.response?.status === 500) {
        setErrorMessage('Bu işlem için Super Admin yetkisi gereklidir. Lütfen Super Admin olarak giriş yapın.');
      } else {
        setErrorMessage(error.message || 'Başvuru reddedilirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthorized) {
      loadApplications();
      loadStats();
    }
  }, [page, statusFilter, isAuthorized]);

  const loadApplications = async () => {
    if (!isAuthorized) return;
    
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await businessService.getAllApplications(statusFilter, page, size);

      const mappedApplications = (response.content || []).map(app => ({
        ...app,
        phone: app.phoneNumber,
        applicationDate: app.createdAt 
          ? new Date(app.createdAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          : (app.applicationDate || ''),
      }));
      setApplications(mappedApplications);
    } catch (error) {
      // 500 hatası için özel mesaj
      if (error.response?.status === 500) {
        setErrorMessage('Bu işlem için Super Admin yetkisi gereklidir. Lütfen Super Admin olarak giriş yapın.');
      } else {
        setErrorMessage(error.message || 'Başvurular yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!isAuthorized) return;
    
    try {
      const statsData = await businessService.getApplicationStats();
      setStats(statsData);
    } catch (error) {
      // Hata mesajını console'a yazdır
      console.error('İstatistikler yüklenirken hata:', error);
      
      // Eğer kritik bir hata değilse (403, 404 gibi), sessizce geç
      // Sadece 500 gibi sunucu hatalarında kullanıcıya bilgi ver
      if (error.message?.includes('Super Admin yetkisi')) {
        // Yetki hatası - zaten yetki kontrolü yapılıyor
        console.warn('İstatistikler için yetki yetersiz');
      } else if (error.message?.includes('404') || error.message?.includes('bulunamadı')) {
        // Endpoint bulunamadı - backend'de endpoint olmayabilir
        console.warn('İstatistik endpoint\'i bulunamadı. Backend\'i kontrol edin.');
        // Varsayılan değerlerle devam et
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      } else {
        // Diğer hatalar için varsayılan değerlerle devam et
        console.warn('İstatistikler yüklenemedi, varsayılan değerler kullanılıyor');
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    }
  };

  // Yetkisiz kullanıcı için uyarı mesajı
  if (!isAuthorized) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          Bu sayfaya erişim için Super Admin yetkisi gereklidir. Ana sayfaya yönlendiriliyorsunuz...
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Başvuru Yönetimi
      </Typography>

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

      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bekleyen Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onaylanan Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reddedilen Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Başvuru Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            İşletme Başvuruları
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && applications.length === 0 && !errorMessage && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Henüz başvuru bulunmamaktadır.
            </Alert>
          )}

          {!loading && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>İşletme Adı</TableCell>
                    <TableCell>İşletme Sahibi</TableCell>
                    <TableCell>İşletme Türü</TableCell>
                    <TableCell>Başvuru Tarihi</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{application.businessName}</TableCell>
                      <TableCell>{application.ownerName}</TableCell>
                      <TableCell>{application.businessType}</TableCell>
                      <TableCell>
                        {application.applicationDate || 
                         (application.createdAt 
                           ? new Date(application.createdAt).toLocaleDateString('tr-TR', {
                               year: 'numeric',
                               month: '2-digit',
                               day: '2-digit'
                             })
                           : '')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(application.status)}
                          color={getStatusColor(application.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(application)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {application.status === 'PENDING' && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApprove(application)}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleReject(application)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
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

      {/* Başvuru Detay Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Başvuru Detayları</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      İşletme Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.businessName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.ownerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Vergi No:
                      </Typography>
                      <Typography variant="body1">{selectedApplication.taxNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.address}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      İşletme Detayları
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>İşletme Türü:</strong> {selectedApplication.businessType}
                    </Typography>
                    {selectedApplication.capacity && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Kapasite:</strong> {selectedApplication.capacity} kişi
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Başvuru Tarihi:</strong> {
                        selectedApplication.createdAt 
                          ? new Date(selectedApplication.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })
                          : (selectedApplication.applicationDate || '')
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Durum:</strong>
                      <Chip
                        label={getStatusLabel(selectedApplication.status)}
                        color={getStatusColor(selectedApplication.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Açıklama
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedApplication.description}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Yüklenen Belgeler
                    </Typography>
                    {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                      selectedApplication.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Belge bulunmamaktadır.
                      </Typography>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
          {selectedApplication?.status === 'PENDING' && (
            <>
              <Button
                onClick={() => handleApprove(selectedApplication)}
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Onayla
              </Button>
              <Button
                onClick={() => handleReject(selectedApplication)}
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
        <DialogTitle>Başvuruyu Onayla</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedApplication?.businessName}</strong> başvurusunu onaylamak istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Onaylandığında işletme için hesap oluşturulacak ve giriş bilgileri email ile gönderilecektir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmApproval} variant="contained" color="success">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Red Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Başvuruyu Reddet</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedApplication?.businessName}</strong> başvurusunu reddetmek istediğinizden emin misiniz?
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)}>İptal</Button>
          <Button
            onClick={confirmRejection}
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Reddet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ApplicationManagementView;

