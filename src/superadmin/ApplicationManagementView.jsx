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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
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
  Schedule as ScheduleIcon,
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

const getDayLabel = (day) => {
  const dayMap = {
    'MONDAY': 'Pazartesi',
    'TUESDAY': 'Salı',
    'WEDNESDAY': 'Çarşamba',
    'THURSDAY': 'Perşembe',
    'FRIDAY': 'Cuma',
    'SATURDAY': 'Cumartesi',
    'SUNDAY': 'Pazar',
  };
  return dayMap[day] || day;
};

function ApplicationManagementView() {
  const navigate = useNavigate();
  const [allApplications, setAllApplications] = useState([]); // Tüm başvurular
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
  const [size, setSize] = useState(10); // Client-side pagination için sayfa başına gösterilecek kayıt sayısı
  const [statusFilter, setStatusFilter] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Client-side pagination: allApplications'dan mevcut sayfadaki başvuruları al
  const paginatedSize = size === allApplications.length ? allApplications.length : size;
  const applications = allApplications.slice(page * paginatedSize, (page + 1) * paginatedSize);
  const totalPages = Math.ceil(allApplications.length / paginatedSize) || 1;
  
  // Sayfa değiştiğinde veya size değiştiğinde, geçersiz sayfadaysak ilk sayfaya dön
  useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(0);
    }
  }, [totalPages, page]);

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

      setAllApplications(prev => prev.map(app =>
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

      setAllApplications(prev => prev.map(app =>
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
  }, [statusFilter, isAuthorized]); // page ve size kaldırıldı - client-side pagination için

  const loadApplications = async () => {
    if (!isAuthorized) return;
    
    setLoading(true);
    setErrorMessage('');

    try {
      // Tüm başvuruları yükle (client-side pagination için)
      const response = await businessService.getAllApplications(statusFilter, 0, 1000);

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
      setAllApplications(mappedApplications);
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
          <Card sx={{ 
            height: '180px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            minWidth: '250px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }}>
                  <BusinessIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  Toplam Başvuru
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
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
                Tüm başvuru sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '180px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            minWidth: '250px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Bekleyen Başvuru
              </Typography>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
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
                Onay bekleyen başvurular
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '180px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            minWidth: '250px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Onaylanan Başvuru
              </Typography>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
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
                Onaylandı sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '180px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            minWidth: '250px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 1
              }}>
                Reddedilen Başvuru
              </Typography>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                fontSize: '2rem',
                textAlign: 'center',
                color: 'error.main'
              }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Reddedilen sayısı
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
            <>
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
              
              {/* Client-side Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 3, mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sayfa başına:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={size}
                        onChange={(e) => {
                          setSize(Number(e.target.value));
                          setPage(0); // Sayfa başına kayıt sayısı değiştiğinde ilk sayfaya dön
                        }}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={allApplications.length}>Tümü</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {page * size + 1}-{Math.min((page + 1) * size, allApplications.length)} / {allApplications.length}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage(0)}
                      disabled={page === 0 || loading}
                    >
                      İlk
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage(prev => Math.max(0, prev - 1))}
                      disabled={page === 0 || loading}
                    >
                      Önceki
                    </Button>
                    <Typography variant="body2">
                      Sayfa {page + 1} / {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={page >= totalPages - 1 || loading}
                    >
                      Sonraki
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPage(totalPages - 1)}
                      disabled={page >= totalPages - 1 || loading}
                    >
                      Son
                    </Button>
                  </Box>
                </Box>
              )}
              {totalPages === 1 && allApplications.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam {allApplications.length} başvuru gösteriliyor
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Başvuru Detayları Modal */}
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
          {selectedApplication?.businessName} - Başvuru Detayları
        </DialogTitle>
        <Divider />
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          {selectedApplication && (
            <Grid container spacing={2}>
              {/* İşletme Bilgileri */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    İşletme Bilgileri
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">İşletme Adı</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.businessName}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">İşletme Sahibi</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.ownerName}
                      </Typography>
                    </Box>
                    
                    {selectedApplication.taxNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Vergi No</Typography>
                        <Typography variant="body1" sx={{ fontWeight: '600' }}>
                          {selectedApplication.taxNumber}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.email}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Telefon</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.phone}
                      </Typography>
                    </Box>
                    
                    {selectedApplication.address && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Adres</Typography>
                        <Typography variant="body1" sx={{ fontWeight: '600' }}>
                          {selectedApplication.address}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* İşletme Detayları */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ height: '100%' }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    İşletme Detayları
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">İşletme Türü</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.businessType}
                      </Typography>
                    </Box>
                    
                    {selectedApplication.capacity && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Kapasite</Typography>
                        <Typography variant="body1" sx={{ fontWeight: '600' }}>
                          {selectedApplication.capacity} kişi
                        </Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Başvuru Tarihi</Typography>
                      <Typography variant="body1" sx={{ fontWeight: '600' }}>
                        {selectedApplication.createdAt 
                          ? new Date(selectedApplication.createdAt).toLocaleDateString('tr-TR')
                          : selectedApplication.applicationDate || ''}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Durum</Typography>
                      <Chip
                        label={getStatusLabel(selectedApplication.status)}
                        color={getStatusColor(selectedApplication.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Açıklama */}
              <Grid item xs={12}>
                <Divider sx={{ mb: 3 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    Açıklama
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {selectedApplication.description || 'Açıklama bulunmamaktadır.'}
                  </Typography>
                </Box>
              </Grid>

              {/* Çalışma Saatleri */}
              {(selectedApplication.openingTime || selectedApplication.closingTime || selectedApplication.workingDays) && (
                <Grid item xs={12}>
                  <Divider sx={{ mb: 3 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Çalışma Saatleri ve Günleri
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(selectedApplication.openingTime || selectedApplication.closingTime) && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Çalışma Saatleri
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: '600' }}>
                            {selectedApplication.openingTime || '09:00'} - {selectedApplication.closingTime || '23:00'}
                          </Typography>
                        </Box>
                      )}
                      
                      {selectedApplication.workingDays && Array.isArray(selectedApplication.workingDays) && selectedApplication.workingDays.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Çalışma Günleri
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedApplication.workingDays.map((day, index) => (
                              <Chip
                                key={index}
                                label={getDayLabel(day)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setDetailDialogOpen(false)}
            variant="outlined"
          >
            Kapat
          </Button>
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
      <Dialog 
        open={approvalDialogOpen} 
        onClose={() => setApprovalDialogOpen(false)}
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
          Başvuruyu Onayla
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            {selectedApplication?.businessName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mekan başvurusu başarıyla onaylanacaktır
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            İşletme için hesap oluşturulacak ve giriş bilgileri email ile gönderilecektir.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setApprovalDialogOpen(false)}
            variant="outlined"
          >
            İptal
          </Button>
          <Button 
            onClick={confirmApproval} 
            variant="contained" 
            color="success"
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
        <DialogTitle sx={{ pb: 2 }}>Başvuruyu Reddet</DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
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
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setRejectionDialogOpen(false)}
            variant="outlined"
          >
            İptal
          </Button>
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

