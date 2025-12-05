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
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { businessService } from '../services/businessService';
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

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
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
        <Box sx={{ mr: 2, color: `${color}.main`, fontSize: '1.5rem' }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div" sx={{ 
          fontWeight: 'bold',
          fontSize: '1rem',
          lineHeight: 1.2
        }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" component="div" sx={{ 
        fontWeight: 'bold', 
        mb: 1,
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{
          textAlign: 'center',
          fontSize: '0.875rem',
          lineHeight: 1.3
        }}>
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
          businessesArray = [];
        }

        // Backend'den gelen verileri frontend formatına map et
        // Email ve tarih bilgisini business application'lardan almak için onaylanmış başvuruları yükle
        let emailMap = new Map(); // businessName -> email mapping
        let dateMap = new Map(); // businessName -> onay tarihi (updatedAt) mapping
        try {
          const applicationsResult = await businessService.getAllApplications('APPROVED', 0, 1000);
          if (applicationsResult && applicationsResult.content) {
            applicationsResult.content.forEach(app => {
              if (app.businessName && app.status === 'APPROVED') {
                const businessNameKey = app.businessName.trim().toLowerCase();
                if (app.email) {
                  emailMap.set(businessNameKey, app.email);
                }
                // Onay tarihini al - öncelik sırası: updatedAt (onay tarihi), approvedAt
                const approvalDate = app.updatedAt || app.approvedAt || app.updated_at || app.approved_at;
                if (approvalDate) {
                  dateMap.set(businessNameKey, approvalDate);
                }
              }
            });
          } else if (Array.isArray(applicationsResult)) {
            applicationsResult.forEach(app => {
              if (app.businessName && app.status === 'APPROVED') {
                const businessNameKey = app.businessName.trim().toLowerCase();
                if (app.email) {
                  emailMap.set(businessNameKey, app.email);
                }
                // Onay tarihini al - öncelik sırası: updatedAt (onay tarihi), approvedAt
                const approvalDate = app.updatedAt || app.approvedAt || app.updated_at || app.approved_at;
                if (approvalDate) {
                  dateMap.set(businessNameKey, approvalDate);
                }
              }
            });
          }
        } catch (error) {
          // Business application'lar yüklenirken hata - sessizce geç
        }
        
        const mappedBusinesses = businessesArray.map(business => {
          let statusValue;
          if (business.isActive !== undefined && business.isActive !== null) {
            statusValue = business.isActive ? 'ACTIVE' : 'INACTIVE';
          } else if (business.status) {
            statusValue = business.status;
          } else {
            statusValue = 'INACTIVE';
          }
          
          // Email alanını nested yapıları da kontrol ederek bul
          let emailValue = business.email || 
                          business.ownerEmail || 
                          business.userEmail || 
                          business.contactEmail ||
                          business.user?.email ||
                          business.owner?.email ||
                          business.user?.username ||
                          business.owner?.username ||
                          (business.user && typeof business.user === 'object' ? business.user.email || business.user.username : null) ||
                          (business.owner && typeof business.owner === 'object' ? business.owner.email || business.owner.username : null);
          
          // Eğer hala email bulunamadıysa, business application'lardan businessName ile eşleştir
          if (!emailValue || emailValue === null) {
            const businessName = business.name?.trim().toLowerCase();
            if (businessName && emailMap.has(businessName)) {
              emailValue = emailMap.get(businessName);
            }
          }
          
          // Son çare olarak '-' göster
          if (!emailValue || emailValue === null) {
            emailValue = '-';
          }
          
          // Tarih formatlaması - önce backend'den gelen alanları kontrol et, sonra business application'lardan al
          let joinDate = '';
          // Backend'den gelebilecek tüm olası tarih alanlarını kontrol et (camelCase ve snake_case)
          const dateFields = [
            business.createdAt,
            business.created_at, // snake_case variant
            business.joinDate,
            business.join_date,
            business.registrationDate,
            business.registration_date,
            business.createdDate,
            business.created_date,
            business.dateCreated,
            business.date_created,
            business.registeredAt,
            business.registered_at,
            business.updatedAt,
            business.updated_at
          ];
          
          // Önce backend'den gelen tarih alanlarını kontrol et
          for (const dateField of dateFields) {
            if (dateField) {
              try {
                const date = new Date(dateField);
                if (!isNaN(date.getTime())) {
                  // Geçerli bir tarih
                  joinDate = date.toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  });
                  break;
                }
              } catch (e) {
                // Tarih formatlama hatası - sessizce geç
              }
            }
          }
          
          // Eğer backend'den tarih gelmediyse, business application'lardan al
          if (!joinDate) {
            const businessName = business.name?.trim().toLowerCase();
            if (businessName && dateMap.has(businessName)) {
              try {
                const appDate = dateMap.get(businessName);
                const date = new Date(appDate);
                if (!isNaN(date.getTime())) {
                  joinDate = date.toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  });
                }
              } catch (e) {
                // Business application tarih formatlama hatası - sessizce geç
              }
            }
          }
          
          // Sıralama için ham tarih bilgisini de sakla
          let sortDate = null;
          for (const dateField of dateFields) {
            if (dateField) {
              try {
                const date = new Date(dateField);
                if (!isNaN(date.getTime())) {
                  sortDate = date;
                  break;
                }
              } catch (e) {
                // Tarih formatlama hatası - sessizce geç
              }
            }
          }
          
          // Eğer backend'den tarih gelmediyse, business application'lardan al
          if (!sortDate) {
            const businessName = business.name?.trim().toLowerCase();
            if (businessName && dateMap.has(businessName)) {
              try {
                const appDate = dateMap.get(businessName);
                sortDate = new Date(appDate);
                if (isNaN(sortDate.getTime())) {
                  sortDate = null;
                }
              } catch (e) {
                // Business application tarih formatlama hatası - sessizce geç
              }
            }
          }
          
          return {
            ...business,
            status: statusValue,
            email: emailValue,
            phone: business.phoneNumber || business.phone || '-',
            address: business.address || business.city || '-',
            joinDate: joinDate || '',
            sortDate: sortDate || new Date(0), // Sıralama için
          };
        });

        // Son eklenen 10 işletmeyi göster - tarihe göre sırala (en yeni önce)
        const sortedBusinesses = mappedBusinesses.sort((a, b) => {
          // En yeni önce (azalan sıra)
          return b.sortDate.getTime() - a.sortDate.getTime();
        });
        
        // Son 10 işletmeyi al
        setBusinesses(sortedBusinesses.slice(0, 10));
      } else {
        setErrorMessage(
          (errorMessage ? errorMessage + ' ' : '') + 
          'İşletme listesi yüklenirken bir hata oluştu: ' + businessesResult.reason.message
        );
        setBusinesses([]);
      }
    } catch (error) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Super Admin Kontrol Paneli
        </Typography>
        
        {/* Hızlı Eylemler - Başlık yanında */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ml: 'auto', mr: 8 }}>
          <Button 
            variant="outlined" 
            startIcon={<CheckCircleIcon />}
            onClick={() => navigate('/admin/application-management')}
            size="small"
          >
            Başvuruları İncele
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<BusinessIcon />}
            onClick={() => navigate('/admin/business-management')}
            size="small"
          >
            İşletme Yönetimi
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<TrendingUpIcon />}
            size="small"
          >
            Raporları Görüntüle
          </Button>
        </Box>
      </Box>

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
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Toplam İşletme"
              value={stats.totalBusinesses.toLocaleString()}
              icon={<BusinessIcon />}
              color="primary"
              subtitle="Kayıtlı işletmeler"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Aktif İşletme"
              value={stats.activeBusinesses.toLocaleString()}
              icon={<CheckCircleIcon />}
              color="success"
              subtitle="Çalışan işletmeler"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Toplam Kullanıcı"
              value={stats.totalUsers.toLocaleString()}
              icon={<PeopleIcon />}
              color="info"
              subtitle="Platform kullanıcıları"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Toplam Rezervasyon"
              value={stats.totalReservations.toLocaleString()}
              icon={<RestaurantIcon />}
              color="info"
              subtitle="Platform geneli"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Bekleyen Başvurular"
              value={stats.pendingApplications}
              icon={<ScheduleIcon />}
              color="warning"
              subtitle="Onay bekleyen başvurular"
            />
          </Grid>
        </Grid>
      )}

      {/* İşletme Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Son Eklenen 10 İşletme
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{business.name}</TableCell>
                      <TableCell>{business.email || '-'}</TableCell>
                      <TableCell>{business.address || '-'}</TableCell>
                      <TableCell>{business.joinDate || ''}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(business.status)}
                          color={getStatusColor(business.status)}
                          size="small"
                        />
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