import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const mockBusinesses = [
  {
    id: 1,
    name: 'Lezzet Durağı',
    email: 'info@lezzetduragi.com',
    phone: '+90 212 555 0123',
    address: 'Kadıköy, İstanbul',
    status: 'Aktif',
    joinDate: '2024-01-15',
    revenue: 45680,
    reservationCount: 1247,
  },
  {
    id: 2,
    name: 'Gurme Restoran',
    email: 'info@gurmerestoran.com',
    phone: '+90 312 555 0456',
    address: 'Çankaya, Ankara',
    status: 'Beklemede',
    joinDate: '2024-02-20',
    revenue: 0,
    reservationCount: 0,
  },
  {
    id: 3,
    name: 'Tatlı Köşe',
    email: 'info@tatlikose.com',
    phone: '+90 232 555 0789',
    address: 'Konak, İzmir',
    status: 'Aktif',
    joinDate: '2024-01-08',
    revenue: 32450,
    reservationCount: 892,
  },
  {
    id: 4,
    name: 'Kahve Evi',
    email: 'info@kahveevi.com',
    phone: '+90 224 555 0321',
    address: 'Osmangazi, Bursa',
    status: 'Pasif',
    joinDate: '2024-03-10',
    revenue: 12500,
    reservationCount: 156,
  },
];

const statusOptions = ['Aktif', 'Beklemede', 'Pasif'];

function BusinessManagementView() {
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Beklemede',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddBusiness = () => {
    const newId = Math.max(...businesses.map(b => b.id)) + 1;
    const businessToAdd = {
      id: newId,
      ...newBusiness,
      joinDate: new Date().toISOString().split('T')[0],
      revenue: 0,
      reservationCount: 0,
    };
    
    setBusinesses(prev => [...prev, businessToAdd]);
    setAddDialogOpen(false);
    setNewBusiness({ name: '', email: '', phone: '', address: '', status: 'Beklemede' });
    setSuccessMessage('İşletme başarıyla eklendi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditBusiness = (business) => {
    setSelectedBusiness(business);
    setNewBusiness({
      name: business.name,
      email: business.email,
      phone: business.phone,
      address: business.address,
      status: business.status,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBusiness = () => {
    if (selectedBusiness) {
      setBusinesses(prev => prev.map(business => 
        business.id === selectedBusiness.id 
          ? { ...business, ...newBusiness }
          : business
      ));
      setEditDialogOpen(false);
      setSelectedBusiness(null);
      setNewBusiness({ name: '', email: '', phone: '', address: '', status: 'Beklemede' });
      setSuccessMessage('İşletme başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteBusiness = (business) => {
    setBusinesses(prev => prev.filter(b => b.id !== business.id));
    setSuccessMessage('İşletme başarıyla silindi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStatusChange = (business, newStatus) => {
    setBusinesses(prev => prev.map(b => 
      b.id === business.id 
        ? { ...b, status: newStatus }
        : b
    ));
  };

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

  const getBusinessStats = () => {
    const total = businesses.length;
    const active = businesses.filter(b => b.status === 'Aktif').length;
    const pending = businesses.filter(b => b.status === 'Beklemede').length;
    const inactive = businesses.filter(b => b.status === 'Pasif').length;
    const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
    
    return { total, active, pending, inactive, totalRevenue };
  };

  const stats = getBusinessStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          İşletme Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          İşletme Ekle
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam İşletme
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif İşletme
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
                Beklemede
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pasif İşletme
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                ₺{stats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Gelir
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* İşletme Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            İşletmeler
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>İşletme Adı</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Adres</TableCell>
                  <TableCell>Kayıt Tarihi</TableCell>
                  <TableCell>Gelir</TableCell>
                  <TableCell>Rezervasyon</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{business.name}</TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>{business.phone}</TableCell>
                    <TableCell>{business.address}</TableCell>
                    <TableCell>{business.joinDate}</TableCell>
                    <TableCell>₺{business.revenue.toLocaleString()}</TableCell>
                    <TableCell>{business.reservationCount}</TableCell>
                    <TableCell>
                      <Chip
                        label={business.status}
                        color={getStatusColor(business.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditBusiness(business)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleStatusChange(business, 'Aktif')}
                        disabled={business.status === 'Aktif'}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteBusiness(business)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* İşletme Ekleme Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni İşletme Ekle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="İşletme Adı"
            value={newBusiness.name}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newBusiness.email}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Telefon"
            value={newBusiness.phone}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, phone: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Adres"
            value={newBusiness.address}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, address: e.target.value }))}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Durum</InputLabel>
            <Select
              value={newBusiness.status}
              label="Durum"
              onChange={(e) => setNewBusiness(prev => ({ ...prev, status: e.target.value }))}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddBusiness} 
            variant="contained"
            disabled={!newBusiness.name || !newBusiness.email || !newBusiness.phone || !newBusiness.address}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* İşletme Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>İşletme Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="İşletme Adı"
            value={newBusiness.name}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newBusiness.email}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Telefon"
            value={newBusiness.phone}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, phone: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Adres"
            value={newBusiness.address}
            onChange={(e) => setNewBusiness(prev => ({ ...prev, address: e.target.value }))}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Durum</InputLabel>
            <Select
              value={newBusiness.status}
              label="Durum"
              onChange={(e) => setNewBusiness(prev => ({ ...prev, status: e.target.value }))}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleUpdateBusiness} 
            variant="contained"
            disabled={!newBusiness.name || !newBusiness.email || !newBusiness.phone || !newBusiness.address}
          >
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BusinessManagementView;





