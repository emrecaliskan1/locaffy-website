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
  Business as BusinessIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  const statusUpper = status?.toUpperCase();
  
  switch (statusUpper) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'INACTIVE':
    case 'PASSIVE':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  // Backend'den gelen status değerlerini Türkçe'ye çevir
  const statusUpper = status?.toUpperCase();
  
  switch (statusUpper) {
    case 'ACTIVE':
      return 'Aktif';
    case 'PENDING':
      return 'Beklemede';
    case 'INACTIVE':
    case 'PASSIVE':
      return 'Pasif';
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
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            mr: 2,
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

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalUsers: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalReservations: 0,
  });

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // İstatistikleri ve işletme listesini ayrı ayrı yükle
      // Çünkü stats endpoint'i henüz backend'de yok
      const [statsResult, businessesResult] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAllBusinesses() // Backend pagination desteklemiyor
      ]);

      // İstatistikler - endpoint henüz yoksa hata göster ama devam et
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        // Stats endpoint'i henüz backend'de yok (403 veya 404 hatası)
        if (statsResult.reason.message === 'DASHBOARD_STATS_NOT_IMPLEMENTED' || 
            statsResult.reason.response?.status === 404 ||
            statsResult.reason.response?.status === 403) {
          // Endpoint henüz oluşturulmadı - kullanıcıya bilgi ver ama devam et
          const warningMsg = 'İstatistik endpoint\'i (/api/admin/dashboard/stats) henüz backend\'de oluşturulmadı. Backend geliştiricisiyle iletişime geçin.';
          if (!errorMessage) {
            setErrorMessage(warningMsg);
          } else {
            setErrorMessage(errorMessage + ' ' + warningMsg);
          }
          // Boş istatistikler göster
          setStats({
            totalBusinesses: 0,
            activeBusinesses: 0,
            totalUsers: 0,
            pendingApplications: 0,
            approvedApplications: 0,
            rejectedApplications: 0,
            totalReservations: 0,
          });
        } else {
          // Diğer hatalar için throw et
          throw statsResult.reason;
        }
      }

      // İşletme listesi - /api/admin/places endpoint'i mevcut
      if (businessesResult.status === 'fulfilled') {
        const businessesData = businessesResult.value;
        
        // Backend direkt array döndürüyor (pagination yok)
        let businessesArray = [];
        if (Array.isArray(businessesData)) {
          businessesArray = businessesData;
        } else if (businessesData.content && Array.isArray(businessesData.content)) {
          businessesArray = businessesData.content;
        } else {
          console.warn('Beklenmeyen response formatı:', businessesData);
          businessesArray = [];
        }

        // Backend'den gelen verileri frontend formatına map et
        const mappedBusinesses = businessesArray.map(business => {
          let statusValue;
          if (business.isActive !== undefined && business.isActive !== null) {
            statusValue = business.isActive ? 'ACTIVE' : 'INACTIVE';
          } else if (business.status) {
            statusValue = business.status;
          } else {
            statusValue = 'INACTIVE';
          }
          
          return {
            ...business,
            status: statusValue,
            email: business.email || business.ownerEmail || business.userEmail || business.contactEmail || '-',
            phone: business.phoneNumber || business.phone || '-',
            address: business.address || business.city || '-',
            joinDate: business.createdAt || business.joinDate || business.registrationDate ? 
              new Date(business.createdAt || business.joinDate || business.registrationDate).toLocaleDateString('tr-TR') : '-',
          };
        });

        setBusinesses(mappedBusinesses);
      } else {
        console.error('İşletme listesi yüklenirken hata:', businessesResult.reason);
        setErrorMessage(
          (errorMessage ? errorMessage + ' ' : '') + 
          'İşletme listesi yüklenirken bir hata oluştu: ' + businessesResult.reason.message
        );
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      setErrorMessage(error.message || 'Dashboard verileri yüklenirken bir hata oluştu');
      
      // 403 hatası durumunda ana sayfaya yönlendir (sadece yetki hatası için)
      if (error.message?.includes('Admin yetkisi') && error.response?.status !== 404) {
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Super Admin Kontrol Paneli
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* İstatistik Kartları */}
      {!loading && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Toplam İşletme"
              value={stats.totalBusinesses.toLocaleString()}
              icon={<BusinessIcon />}
              color="primary"
              subtitle="Kayıtlı işletmeler"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Aktif İşletme"
              value={stats.activeBusinesses.toLocaleString()}
              icon={<CheckCircleIcon />}
              color="success"
              subtitle="Çalışan işletmeler"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Toplam Kullanıcı"
              value={stats.totalUsers.toLocaleString()}
              icon={<PeopleIcon />}
              color="info"
              subtitle="Platform kullanıcıları"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Bekleyen Başvurular"
              value={stats.pendingApplications}
              icon={<ScheduleIcon />}
              color="warning"
              subtitle="Onay bekleyen başvurular"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Toplam Rezervasyon"
              value={stats.totalReservations.toLocaleString()}
              icon={<RestaurantIcon />}
              color="info"
              subtitle="Platform geneli"
            />
          </Grid>
        </Grid>
      )}

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
              onClick={() => navigate('/admin/application-management')}
            >
              Başvuruları İncele
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<BusinessIcon />}
              onClick={() => navigate('/admin/business-management')}
            >
              İşletme Yönetimi
            </Button>
            <Button variant="outlined" startIcon={<TrendingUpIcon />}>
              Raporları Görüntüle
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* İşletme Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            İşletmeler
          </Typography>
          
          {loading && businesses.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : businesses.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Henüz işletme bulunmamaktadır.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>İşletme Adı</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Adres</TableCell>
                    <TableCell>Kayıt Tarihi</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{business.name}</TableCell>
                      <TableCell>{business.email || '-'}</TableCell>
                      <TableCell>{business.address || '-'}</TableCell>
                      <TableCell>{business.joinDate || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(business.status)}
                          color={getStatusColor(business.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => navigate(`/admin/business-management`)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <CancelIcon />
                        </IconButton>
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

export default SuperAdminDashboard;