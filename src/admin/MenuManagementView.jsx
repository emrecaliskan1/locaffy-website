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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  QrCode as QrCodeIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import QRCode from 'react-qr-code';

// Mock data - gerçek uygulamada API'den gelecek
const mockMenuItems = [
  {
    id: 1,
    name: 'Adana Kebap',
    category: 'Ana Yemek',
    price: 85,
    isActive: true,
    description: 'Acılı kıyma ile hazırlanan geleneksel kebap',
  },
  {
    id: 2,
    name: 'Mercimek Çorbası',
    category: 'Çorba',
    price: 25,
    isActive: true,
    description: 'Geleneksel mercimek çorbası',
  },
  {
    id: 3,
    name: 'Baklava',
    category: 'Tatlı',
    price: 45,
    isActive: false,
    description: 'Antep fıstıklı baklava',
  },
  {
    id: 4,
    name: 'Ayran',
    category: 'İçecek',
    price: 15,
    isActive: true,
    description: 'Ev yapımı ayran',
  },
  {
    id: 5,
    name: 'Pide',
    category: 'Ana Yemek',
    price: 35,
    isActive: true,
    description: 'Çeşitli malzemelerle hazırlanan pide',
  },
];

const categories = ['Ana Yemek', 'Çorba', 'Salata', 'Tatlı', 'İçecek', 'Meze'];

function MenuManagementView() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    isActive: true,
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddItem = () => {
    const newId = Math.max(...menuItems.map(item => item.id)) + 1;
    const itemToAdd = {
      id: newId,
      ...newItem,
      price: parseFloat(newItem.price),
    };

    setMenuItems(prev => [...prev, itemToAdd]);
    setAddDialogOpen(false);
    setNewItem({ name: '', category: '', price: '', description: '', isActive: true });
    setSuccessMessage('Menü öğesi başarıyla eklendi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      isActive: item.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      setMenuItems(prev => prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, ...newItem, price: parseFloat(newItem.price) }
          : item
      ));
      setEditDialogOpen(false);
      setSelectedItem(null);
      setNewItem({ name: '', category: '', price: '', description: '', isActive: true });
      setSuccessMessage('Menü öğesi başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteItem = (item) => {
    setMenuItems(prev => prev.filter(menuItem => menuItem.id !== item.id));
    setSuccessMessage('Menü öğesi başarıyla silindi!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleActive = (item) => {
    setMenuItems(prev => prev.map(menuItem =>
      menuItem.id === item.id
        ? { ...menuItem, isActive: !menuItem.isActive }
        : menuItem
    ));
  };

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(category => {
      stats[category] = menuItems.filter(item => item.category === category).length;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();
  const totalItems = menuItems.length;
  const activeItems = menuItems.filter(item => item.isActive).length;
  const inactiveItems = totalItems - activeItems;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Menü Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Ürün Ekle
        </Button>
      </Box>

      {/* QR Menü Linki */}
      <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1, mr: 2 }}>
              <QRCode
                value={`${window.location.origin}/menu/1`}
                size={64}
              />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Dijital QR Menünüz Hazır!
              </Typography>
              <Typography variant="body2">
                Müşterileriniz bu link üzerinden menünüze ulaşabilir.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ mr: 2, fontFamily: 'monospace' }}>
              {window.location.origin}/menu/my-cafe
            </Typography>
            <Button
              size="small"
              startIcon={<CopyIcon />}
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/menu/my-cafe`);
                setSuccessMessage('Link kopyalandı!');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
            >
              Kopyala
            </Button>
          </Box>
        </CardContent>
      </Card>

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
              <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Ürün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {activeItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Ürün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {inactiveItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pasif Ürün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {categories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kategori
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kategori İstatistikleri */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Kategori Dağılımı
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                  <Typography variant="body1">{category}</Typography>
                  <Chip
                    label={categoryStats[category]}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Menü Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Menü Öğeleri
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ürün Adı</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Fiyat</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                    <TableCell>
                      <Chip label={item.category} color="primary" size="small" />
                    </TableCell>
                    <TableCell>₺{item.price}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.isActive}
                        onChange={() => handleToggleActive(item)}
                        color="success"
                      />
                      <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                        {item.isActive ? 'Aktif' : 'Pasif'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditItem(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteItem(item)}
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

      {/* Ürün Ekleme Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={newItem.category}
              label="Kategori"
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Fiyat (₺)"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>İptal</Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disabled={!newItem.name || !newItem.category || !newItem.price}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ürün Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ürün Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={newItem.category}
              label="Kategori"
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Fiyat (₺)"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button
            onClick={handleUpdateItem}
            variant="contained"
            disabled={!newItem.name || !newItem.category || !newItem.price}
          >
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MenuManagementView;

