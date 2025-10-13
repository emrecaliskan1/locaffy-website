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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon,
  LocalOffer as LocalOfferIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const mockPromotions = [
  {
    id: 1,
    name: 'Hafta Sonu Özel',
    type: 'İndirim',
    discountValue: 15,
    targetAudience: 'Tüm Müşteriler',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    description: 'Hafta sonları %15 indirim',
    minOrderAmount: 100,
    maxUsageCount: 1000,
    usedCount: 45,
  },
  {
    id: 2,
    name: 'Öğrenci İndirimi',
    type: 'İndirim',
    discountValue: 20,
    targetAudience: 'Öğrenciler',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    description: 'Öğrenci kartı gösterenlere %20 indirim',
    minOrderAmount: 50,
    maxUsageCount: 500,
    usedCount: 23,
  },
  {
    id: 3,
    name: 'Doğum Günü Hediyesi',
    type: 'Ücretsiz Ürün',
    discountValue: 0,
    targetAudience: 'Doğum Günü Olanlar',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: false,
    description: 'Doğum gününde ücretsiz tatlı',
    minOrderAmount: 0,
    maxUsageCount: 100,
    usedCount: 12,
  },
];

const promotionTypes = ['İndirim', 'Ücretsiz Ürün', 'Hediye', 'Özel Menü'];
const targetAudiences = ['Tüm Müşteriler', 'Öğrenciler', 'Yaşlılar', 'Çocuklar', 'Doğum Günü Olanlar', 'İlk Kez Gelenler'];

function PromotionsView() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'İndirim',
    discountValue: 0,
    targetAudience: 'Tüm Müşteriler',
    startDate: '',
    endDate: '',
    description: '',
    minOrderAmount: 0,
    maxUsageCount: 1000,
    isActive: true,
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddPromotion = () => {
    const newId = Math.max(...promotions.map(p => p.id)) + 1;
    const promotionToAdd = {
      id: newId,
      ...newPromotion,
      usedCount: 0,
    };
    
    setPromotions(prev => [...prev, promotionToAdd]);
    setAddDialogOpen(false);
    setNewPromotion({
      name: '',
      type: 'İndirim',
      discountValue: 0,
      targetAudience: 'Tüm Müşteriler',
      startDate: '',
      endDate: '',
      description: '',
      minOrderAmount: 0,
      maxUsageCount: 1000,
      isActive: true,
    });
    setSuccessMessage('Kampanya başarıyla eklendi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setNewPromotion({
      name: promotion.name,
      type: promotion.type,
      discountValue: promotion.discountValue,
      targetAudience: promotion.targetAudience,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      description: promotion.description,
      minOrderAmount: promotion.minOrderAmount,
      maxUsageCount: promotion.maxUsageCount,
      isActive: promotion.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleUpdatePromotion = () => {
    if (selectedPromotion) {
      setPromotions(prev => prev.map(promotion => 
        promotion.id === selectedPromotion.id 
          ? { ...promotion, ...newPromotion }
          : promotion
      ));
      setEditDialogOpen(false);
      setSelectedPromotion(null);
      setNewPromotion({
        name: '',
        type: 'İndirim',
        discountValue: 0,
        targetAudience: 'Tüm Müşteriler',
        startDate: '',
        endDate: '',
        description: '',
        minOrderAmount: 0,
        maxUsageCount: 1000,
        isActive: true,
      });
      setSuccessMessage('Kampanya başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeletePromotion = (promotion) => {
    setPromotions(prev => prev.filter(p => p.id !== promotion.id));
    setSuccessMessage('Kampanya başarıyla silindi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleActive = (promotion) => {
    setPromotions(prev => prev.map(p => 
      p.id === promotion.id 
        ? { ...p, isActive: !p.isActive }
        : p
    ));
  };

  const getPromotionStats = () => {
    const total = promotions.length;
    const active = promotions.filter(p => p.isActive).length;
    const inactive = total - active;
    const totalUsage = promotions.reduce((sum, p) => sum + p.usedCount, 0);
    
    return { total, active, inactive, totalUsage };
  };

  const stats = getPromotionStats();

  const getPromotionTypeColor = (type) => {
    switch (type) {
      case 'İndirim':
        return 'success';
      case 'Ücretsiz Ürün':
        return 'info';
      case 'Hediye':
        return 'warning';
      case 'Özel Menü':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Promosyon ve Kampanyalar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Kampanya Oluştur
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CampaignIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Kampanya
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Kampanya
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pasif Kampanya
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {stats.totalUsage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Kullanım
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kampanya Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Kampanyalar
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kampanya Adı</TableCell>
                  <TableCell>Tür</TableCell>
                  <TableCell>Değer</TableCell>
                  <TableCell>Hedef Kitle</TableCell>
                  <TableCell>Başlangıç</TableCell>
                  <TableCell>Bitiş</TableCell>
                  <TableCell>Kullanım</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{promotion.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={promotion.type} 
                        color={getPromotionTypeColor(promotion.type)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {promotion.type === 'İndirim' ? `%${promotion.discountValue}` : 'Ücretsiz'}
                    </TableCell>
                    <TableCell>{promotion.targetAudience}</TableCell>
                    <TableCell>{promotion.startDate}</TableCell>
                    <TableCell>{promotion.endDate}</TableCell>
                    <TableCell>
                      {promotion.usedCount}/{promotion.maxUsageCount}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={promotion.isActive}
                        onChange={() => handleToggleActive(promotion)}
                        color="success"
                      />
                      <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                        {promotion.isActive ? 'Aktif' : 'Pasif'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeletePromotion(promotion)}
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

      {/* Kampanya Ekleme Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kampanya Adı"
                value={newPromotion.name}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kampanya Türü</InputLabel>
                <Select
                  value={newPromotion.type}
                  label="Kampanya Türü"
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e.target.value }))}
                >
                  {promotionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={newPromotion.type === 'İndirim' ? 'İndirim Yüzdesi' : 'Değer'}
                type="number"
                value={newPromotion.discountValue}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, discountValue: parseInt(e.target.value) }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{newPromotion.type === 'İndirim' ? '%' : '₺'}</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Hedef Kitle</InputLabel>
                <Select
                  value={newPromotion.targetAudience}
                  label="Hedef Kitle"
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, targetAudience: e.target.value }))}
                >
                  {targetAudiences.map((audience) => (
                    <MenuItem key={audience} value={audience}>
                      {audience}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Başlangıç Tarihi"
                type="date"
                value={newPromotion.startDate}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bitiş Tarihi"
                type="date"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Sipariş Tutarı"
                type="number"
                value={newPromotion.minOrderAmount}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderAmount: parseInt(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maksimum Kullanım Sayısı"
                type="number"
                value={newPromotion.maxUsageCount}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsageCount: parseInt(e.target.value) }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                value={newPromotion.description}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newPromotion.isActive}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, isActive: e.target.checked }))}
                    color="primary"
                  />
                }
                label="Kampanyayı Aktif Et"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleAddPromotion} 
            variant="contained"
            disabled={!newPromotion.name || !newPromotion.startDate || !newPromotion.endDate}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kampanya Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Kampanya Düzenle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kampanya Adı"
                value={newPromotion.name}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kampanya Türü</InputLabel>
                <Select
                  value={newPromotion.type}
                  label="Kampanya Türü"
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e.target.value }))}
                >
                  {promotionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={newPromotion.type === 'İndirim' ? 'İndirim Yüzdesi' : 'Değer'}
                type="number"
                value={newPromotion.discountValue}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, discountValue: parseInt(e.target.value) }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{newPromotion.type === 'İndirim' ? '%' : '₺'}</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Hedef Kitle</InputLabel>
                <Select
                  value={newPromotion.targetAudience}
                  label="Hedef Kitle"
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, targetAudience: e.target.value }))}
                >
                  {targetAudiences.map((audience) => (
                    <MenuItem key={audience} value={audience}>
                      {audience}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Başlangıç Tarihi"
                type="date"
                value={newPromotion.startDate}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bitiş Tarihi"
                type="date"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Sipariş Tutarı"
                type="number"
                value={newPromotion.minOrderAmount}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderAmount: parseInt(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maksimum Kullanım Sayısı"
                type="number"
                value={newPromotion.maxUsageCount}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsageCount: parseInt(e.target.value) }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                value={newPromotion.description}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newPromotion.isActive}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, isActive: e.target.checked }))}
                    color="primary"
                  />
                }
                label="Kampanyayı Aktif Et"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleUpdatePromotion} 
            variant="contained"
            disabled={!newPromotion.name || !newPromotion.startDate || !newPromotion.endDate}
          >
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PromotionsView;





