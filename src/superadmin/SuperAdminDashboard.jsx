import React from 'react';
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

// Mock data - gerçek uygulamada API'den gelecek
const mockStats = {
  totalBusinesses: 1247,
  activeBusinesses: 1156,
  totalUsers: 45680,
  totalRevenue: 1250000,
  pendingApplications: 23,
  approvedApplications: 89,
  rejectedApplications: 12,
  totalReservations: 89456,
};

const mockBusinesses = [
  {
    id: 1,
    name: 'Lezzet Durağı',
    email: 'info@lezzetduragi.com',
    status: 'Aktif',
    city: 'İstanbul',
    joinDate: '2024-01-15',
    revenue: 45680,
  },
  {
    id: 2,
    name: 'Gurme Restoran',
    email: 'info@gurmerestoran.com',
    status: 'Beklemede',
    city: 'Ankara',
    joinDate: '2024-02-20',
    revenue: 0,
  },
  {
    id: 3,
    name: 'Tatlı Köşe',
    email: 'info@tatlikose.com',
    status: 'Aktif',
    city: 'İzmir',
    joinDate: '2024-01-08',
    revenue: 32450,
  },
  {
    id: 4,
    name: 'Kahve Evi',
    email: 'info@kahveevi.com',
    status: 'Pasif',
    city: 'Bursa',
    joinDate: '2024-03-10',
    revenue: 12500,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Aktif':
      return 'success';
    case 'Beklemede':
      return 'warning';
    case 'Pasif':
      return 'error';
    default:
      return 'default';
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
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Super Admin Kontrol Paneli
      </Typography>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam İşletme"
            value={mockStats.totalBusinesses.toLocaleString()}
            icon={<BusinessIcon />}
            color="primary"
            subtitle="Kayıtlı işletmeler"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Aktif İşletme"
            value={mockStats.activeBusinesses.toLocaleString()}
            icon={<CheckCircleIcon />}
            color="success"
            subtitle="Çalışan işletmeler"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Kullanıcı"
            value={mockStats.totalUsers.toLocaleString()}
            icon={<PeopleIcon />}
            color="info"
            subtitle="Platform kullanıcıları"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Gelir"
            value={`₺${mockStats.totalRevenue.toLocaleString()}`}
            icon={<MonetizationOnIcon />}
            color="success"
            subtitle="Platform geliri"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Bekleyen Başvurular"
            value={mockStats.pendingApplications}
            icon={<ScheduleIcon />}
            color="warning"
            subtitle="Onay bekleyen başvurular"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Rezervasyon"
            value={mockStats.totalReservations.toLocaleString()}
            icon={<RestaurantIcon />}
            color="info"
            subtitle="Platform geneli"
          />
        </Grid>
      </Grid>

      {/* Hızlı Eylemler */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hızlı Eylemler
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<CheckCircleIcon />}>
              Başvuruları İncele
            </Button>
            <Button variant="outlined" startIcon={<BusinessIcon />}>
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
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>İşletme Adı</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Şehir</TableCell>
                  <TableCell>Kayıt Tarihi</TableCell>
                  <TableCell>Gelir</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockBusinesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{business.name}</TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>{business.city}</TableCell>
                    <TableCell>{business.joinDate}</TableCell>
                    <TableCell>₺{business.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={business.status}
                        color={getStatusColor(business.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
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
        </CardContent>
      </Card>
    </Box>
  );
}

export default SuperAdminDashboard;
