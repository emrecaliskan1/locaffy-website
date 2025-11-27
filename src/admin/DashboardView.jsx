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
  LinearProgress,
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

// Mock data - gerçek uygulamada API'den gelecek
const mockStats = {
  monthlyReservations: 1247,
  occupancyRate: 78.5,
  cancellationCount: 23,
  estimatedRevenue: 45680,
  groupReservations: 89,
  averageWaitTime: 12,
};

const mockReservations = [
  {
    id: 1,
    customerName: 'Ahmet Yılmaz',
    tableNumber: 'A12',
    time: '19:30',
    status: 'Başarılı',
    people: 4,
  },
  {
    id: 2,
    customerName: 'Fatma Demir',
    tableNumber: 'B05',
    time: '20:15',
    status: 'Onay Bekliyor',
    people: 2,
  },
  {
    id: 3,
    customerName: 'Mehmet Kaya',
    tableNumber: 'C08',
    time: '18:45',
    status: 'Gecikmeli',
    people: 6,
  },
  {
    id: 4,
    customerName: 'Ayşe Özkan',
    tableNumber: 'A03',
    time: '21:00',
    status: 'İptal Edildi',
    people: 3,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Başarılı':
      return 'success';
    case 'Onay Bekliyor':
      return 'warning';
    case 'Gecikmeli':
      return 'info';
    case 'İptal Edildi':
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

function DashboardView() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Kontrol Paneli
      </Typography>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Aylık Rezervasyon"
            value={mockStats.monthlyReservations.toLocaleString()}
            icon={<RestaurantIcon />}
            color="primary"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Doluluk Oranı"
            value={`%${mockStats.occupancyRate}`}
            icon={<TrendingUpIcon />}
            color="success"
            subtitle="Ortalama"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tahmini Gelir"
            value={`₺${mockStats.estimatedRevenue.toLocaleString()}`}
            icon={<MonetizationOnIcon />}
            color="success"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="İptal Sayısı"
            value={mockStats.cancellationCount}
            icon={<CancelIcon />}
            color="error"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Grup Rezervasyonları"
            value={mockStats.groupReservations}
            icon={<PeopleIcon />}
            color="info"
            subtitle="Bu ay"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ortalama Bekleme"
            value={`${mockStats.averageWaitTime} dk`}
            icon={<ScheduleIcon />}
            color="warning"
            subtitle="Günlük ortalama"
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
              onClick={() => window.open(`${window.location.origin}/menu/1`, '_blank')}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Menüyü Görüntüle
            </Button>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
            <QRCode
              value={`${window.location.origin}/menu/1`}
              size={120}
              level="H"
            />
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
            <Button variant="contained" startIcon={<CheckCircleIcon />}>
              Toplu Onaylama
            </Button>
            <Button variant="outlined" startIcon={<RestaurantIcon />}>
              Masa Durumu Güncelle
            </Button>
            <Button variant="outlined" startIcon={<PeopleIcon />}>
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
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Müşteri</TableCell>
                  <TableCell>Masa</TableCell>
                  <TableCell>Saat</TableCell>
                  <TableCell>Kişi Sayısı</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.customerName}</TableCell>
                    <TableCell>{reservation.tableNumber}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.people}</TableCell>
                    <TableCell>
                      <Chip
                        label={reservation.status}
                        color={getStatusColor(reservation.status)}
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

export default DashboardView;

