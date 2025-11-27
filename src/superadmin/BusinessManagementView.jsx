import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';

// Backend'den gelen status değerlerini Türkçe'ye çevir
const getStatusLabel = (status) => {
  const statusUpper = status?.toUpperCase();
  switch (statusUpper) {
    case 'ACTIVE':
      return 'Aktif';
    case 'INACTIVE':
    case 'PASSIVE':
      return 'Pasif';
    case 'PENDING':
      return 'Beklemede';
    default:
      return status || '-';
  }
};

// Backend status değerlerini frontend status değerlerine map et
const mapBackendStatusToFrontend = (status) => {
  const statusUpper = status?.toUpperCase();
  switch (statusUpper) {
    case 'ACTIVE':
      return 'Aktif';
    case 'INACTIVE':
    case 'PASSIVE':
      return 'Pasif';
    case 'PENDING':
      return 'Beklemede';
    default:
      return status;
  }
};

const statusOptions = ['Aktif', 'Beklemede', 'Pasif'];

function BusinessManagementView() {
  const [businesses, setBusinesses] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Beklemede',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(100); // Tüm işletmeleri getirmek için büyük sayı

  const handleAddBusiness = () => {
    // NOT: Backend'de POST /api/admin/places endpoint'i yok
    // Bu özellik backend'de oluşturulana kadar disabled olmalı
    setErrorMessage('İşletme ekleme özelliği henüz backend\'de oluşturulmadı. Backend geliştiricisiyle iletişime geçin.');
    setAddDialogOpen(false);
    // Geçici olarak mock data ekleme (backend endpoint oluşturulana kadar)
    // const newId = Math.max(...businesses.map(b => b.id), 0) + 1;
    // const businessToAdd = {
    //   id: newId,
    //   ...newBusiness,
    //   joinDate: new Date().toISOString().split('T')[0],
    //   revenue: 0,
    //   reservationCount: 0,
    // };
    // setBusinesses(prev => [...prev, businessToAdd]);
    // setSuccessMessage('İşletme başarıyla eklendi!');
    // setTimeout(() => setSuccessMessage(''), 3000);
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

  const handleUpdateBusiness = async () => {
    if (!selectedBusiness) return;

    // NOT: Backend'de PUT /api/admin/places/{id} endpoint'i yok
    // Bu özellik backend'de oluşturulana kadar disabled olmalı
    setErrorMessage('İşletme güncelleme özelliği henüz backend\'de oluşturulmadı. Backend geliştiricisiyle iletişime geçin.');
    setEditDialogOpen(false);
    setSelectedBusiness(null);
    setNewBusiness({ name: '', email: '', phone: '', address: '', status: 'Beklemede' });
    
    // Geçici olarak mock data güncelleme (backend endpoint oluşturulana kadar)
    // setBusinesses(prev => prev.map(business => 
    //   business.id === selectedBusiness.id 
    //     ? { ...business, ...newBusiness }
    //     : business
    // ));
    // setSuccessMessage('İşletme başarıyla güncellendi!');
    // setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteBusiness = (business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBusiness = async () => {
    if (!selectedBusiness) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await adminService.deleteBusiness(selectedBusiness.id);
      
      setBusinesses(prev => prev.filter(b => b.id !== selectedBusiness.id));
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
      setSuccessMessage('İşletme başarıyla silindi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'İşletme silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (business) => {
    setLoading(true);
    setErrorMessage('');

    try {
      await adminService.toggleBusinessStatus(business.id);
      
      // Başarılı olursa listeyi yeniden yükle
      await loadBusinesses();
      
      setSuccessMessage('İşletme durumu başarıyla değiştirildi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'İşletme durumu değiştirilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde işletmeleri yükle
  useEffect(() => {
    loadBusinesses();
  }, [page]);

  const loadBusinesses = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await adminService.getAllBusinesses(page, size);
      
      // Pagination response yapısına göre businesses'ı set et
      let businessesData = [];
      if (response.content) {
        businessesData = response.content;
      } else if (Array.isArray(response)) {
        businessesData = response;
      }

      // Backend'den gelen status değerlerini frontend formatına çevir
      const mappedBusinesses = businessesData.map(business => ({
        ...business,
        status: mapBackendStatusToFrontend(business.status),
        // Backend'den gelen alanları frontend formatına uyarla
        phone: business.phone || business.phoneNumber || '-',
        address: business.address || business.city || '-',
        joinDate: business.joinDate || business.createdAt ? 
          new Date(business.joinDate || business.createdAt).toLocaleDateString('tr-TR') : '-',
        revenue: business.revenue || 0,
        reservationCount: business.reservationCount || 0,
      }));

      setBusinesses(mappedBusinesses);
    } catch (error) {
      console.error('İşletmeler yüklenirken hata:', error);
      setErrorMessage(error.message || 'İşletmeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    if (statusUpper === 'AKTIF' || statusUpper === 'ACTIVE') {
      return 'success';
    } else if (statusUpper === 'BEKLEMEDE' || statusUpper === 'PENDING') {
      return 'warning';
    } else if (statusUpper === 'PASIF' || statusUpper === 'INACTIVE' || statusUpper === 'PASSIVE') {
      return 'error';
    }
    return 'default';
  };

  const getBusinessStats = () => {
    const total = businesses.length;
    const active = businesses.filter(b => {
      const status = b.status?.toUpperCase();
      return status === 'AKTIF' || status === 'ACTIVE';
    }).length;
    const pending = businesses.filter(b => {
      const status = b.status?.toUpperCase();
      return status === 'BEKLEMEDE' || status === 'PENDING';
    }).length;
    const inactive = businesses.filter(b => {
      const status = b.status?.toUpperCase();
      return status === 'PASIF' || status === 'INACTIVE' || status === 'PASSIVE';
    }).length;
    const totalRevenue = businesses.reduce((sum, b) => sum + (b.revenue || 0), 0);
    
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
          disabled={true}
          title="İşletme ekleme özelliği henüz backend'de oluşturulmadı"
        >
          İşletme Ekle
        </Button>
      </Box>

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
          
          {loading && businesses.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : businesses.length === 0 && !errorMessage ? (
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
                    <TableCell>{business.email || '-'}</TableCell>
                    <TableCell>{business.phone || '-'}</TableCell>
                    <TableCell>{business.address || business.city || '-'}</TableCell>
                    <TableCell>{business.joinDate || '-'}</TableCell>
                    <TableCell>₺{(business.revenue || 0).toLocaleString()}</TableCell>
                    <TableCell>{business.reservationCount || 0}</TableCell>
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
                        onClick={() => handleEditBusiness(business)}
                        disabled={loading}
                        title="Güncelleme özelliği henüz backend'de oluşturulmadı"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleStatusChange(business)}
                        disabled={loading}
                        title="Durumu Değiştir"
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteBusiness(business)}
                        disabled={loading}
                        title="Sil"
                      >
                        <DeleteIcon fontSize="small" />
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

      {/* İşletme Silme Onay Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>İşletmeyi Sil</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedBusiness?.name}</strong> işletmesini silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            İptal
          </Button>
          <Button 
            onClick={confirmDeleteBusiness} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BusinessManagementView;





