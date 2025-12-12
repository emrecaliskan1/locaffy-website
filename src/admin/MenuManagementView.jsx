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
  CircularProgress,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  QrCode as QrCodeIcon,
  ContentCopy as CopyIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import menuService from '../services/menuService';
import { reservationService } from '../services/reservationService';

function MenuManagementView() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [placeId, setPlaceId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    isAvailable: true,
    tags: '',
    displayOrder: 0,
  });

  useEffect(() => {
    loadPlaceId();
    loadMenuItems();
    loadCategories();
  }, []);

  const loadPlaceId = async () => {
    try {
      const places = await reservationService.getMyPlaces();
      if (places && Array.isArray(places) && places.length > 0) {
        const firstPlace = places[0];
        setPlaceId(firstPlace.id);
      }
    } catch (error) {
      console.error('İşletme bilgileri yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    let filtered = [...menuItems];

    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategoryFilter);
    }

    filtered.sort((a, b) => {
      const orderA = a.displayOrder || 0;
      const orderB = b.displayOrder || 0;
      return orderA - orderB;
    });

    setFilteredMenuItems(filtered);
  }, [menuItems, selectedCategoryFilter]);

  const loadMenuItems = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const items = await menuService.getMyItems();
      
      // Backend'den gelen veriyi normalize et (backend 'available' kullanıyor, frontend 'isAvailable' bekliyor)
      const normalizedItems = items.map(item => {
        // Backend 'available' alanını kullanıyor, 'isAvailable' değil
        let isAvailableValue = item.available !== undefined ? item.available : 
                              (item.isAvailable !== undefined ? item.isAvailable : 
                              (item.isActive !== undefined ? item.isActive : true));
        
        // String değerleri boolean'a çevir
        if (typeof isAvailableValue === 'string') {
          isAvailableValue = isAvailableValue === 'true' || isAvailableValue === '1';
        }
        
        // Boolean'a çevir (null, undefined için true - default aktif)
        if (isAvailableValue === null || isAvailableValue === undefined) {
          isAvailableValue = true; // Default olarak aktif
        }
        
        return {
          ...item,
          isAvailable: Boolean(isAvailableValue),
          // 'available' alanını da koru (geriye dönük uyumluluk için)
          available: Boolean(isAvailableValue)
        };
      });
      
      setMenuItems(normalizedItems);
    } catch (error) {
      setErrorMessage(error.message || 'Menü öğeleri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await menuService.getMyCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setCategories([]);
    }
  };

  const handleAddItem = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!newItem.name || !newItem.category || !newItem.price) {
        setErrorMessage('Lütfen tüm zorunlu alanları doldurun.');
        setLoading(false);
        return;
      }

      const itemData = {
        name: newItem.name.trim(),
        description: newItem.description?.trim() || null,
        price: parseFloat(newItem.price),
        category: newItem.category.trim(),
        available: newItem.isAvailable !== undefined ? newItem.isAvailable : true, // Backend 'available' bekliyor
        tags: newItem.tags || null,
        displayOrder: newItem.displayOrder || 0
      };

      // Önce ürünü oluştur
      const createdItem = await menuService.createMenuItem(itemData);

      // Eğer fotoğraf seçildiyse, fotoğrafı yükle
      if (selectedFile) {
        try {
          await menuService.uploadMenuItemImage(createdItem.id, selectedFile);
        } catch (imageError) {
          // Fotoğraf yükleme hatası - ürün oluşturuldu ama fotoğraf yüklenemedi
          console.warn('Fotoğraf yüklenirken hata:', imageError);
          setErrorMessage('Ürün oluşturuldu ancak fotoğraf yüklenirken bir hata oluştu: ' + imageError.message);
        }
      }

      await loadMenuItems();

      setAddDialogOpen(false);
      setNewItem({
        name: '',
        category: '',
        price: '',
        description: '',
        isAvailable: true,
        tags: '',
        displayOrder: 0
      });
      setSelectedFile(null);
      setImagePreview(null);
      setSuccessMessage('Menü öğesi başarıyla eklendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Menü öğesi eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      tags: item.tags || '',
      displayOrder: item.displayOrder || 0
    });
    // Mevcut fotoğraf varsa preview olarak göster
    if (item.imageUrl) {
      setImagePreview(item.imageUrl);
    } else {
      setImagePreview(null);
    }
    setSelectedFile(null);
    setEditDialogOpen(true);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!newItem.name || !newItem.category || !newItem.price) {
        setErrorMessage('Lütfen tüm zorunlu alanları doldurun.');
        setLoading(false);
        return;
      }

      const itemData = {
        name: newItem.name.trim(),
        description: newItem.description || null,
        price: parseFloat(newItem.price),
        category: newItem.category.trim(),
        available: newItem.isAvailable !== undefined ? newItem.isAvailable : true, // Backend 'available' bekliyor
        tags: newItem.tags || null,
        displayOrder: newItem.displayOrder || 0
      };

      // Önce ürünü güncelle
      await menuService.updateMenuItem(selectedItem.id, itemData);

      // Eğer yeni fotoğraf seçildiyse, fotoğrafı yükle
      if (selectedFile) {
        try {
          await menuService.uploadMenuItemImage(selectedItem.id, selectedFile);
        } catch (imageError) {
          // Fotoğraf yükleme hatası - ürün güncellendi ama fotoğraf yüklenemedi
          console.warn('Fotoğraf yüklenirken hata:', imageError);
          setErrorMessage('Ürün güncellendi ancak fotoğraf yüklenirken bir hata oluştu: ' + imageError.message);
        }
      }

      await loadMenuItems();

      setEditDialogOpen(false);
      setSelectedItem(null);
      setNewItem({
        name: '',
        category: '',
        price: '',
        description: '',
        isAvailable: true,
        tags: '',
        displayOrder: 0
      });
      setSelectedFile(null);
      setImagePreview(null);
      setSuccessMessage('Menü öğesi başarıyla güncellendi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Menü öğesi güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!selectedItem) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await menuService.deleteMenuItem(selectedItem.id);

      await loadMenuItems();
      
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      setSuccessMessage('Menü öğesi başarıyla silindi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Menü öğesi silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (item) => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Mevcut durumu al (normalize edilmiş isAvailable veya available)
      const currentStatus = item.isAvailable !== undefined ? item.isAvailable : 
                           (item.available !== undefined ? item.available : true);
      const newStatus = !currentStatus;

      const updatedItem = {
        name: item.name,
        description: item.description || null,
        price: item.price,
        category: item.category,
        available: newStatus, // Backend 'available' bekliyor
        tags: item.tags || null,
        displayOrder: item.displayOrder || 0
      }

      await menuService.updateMenuItem(item.id, updatedItem);

      await loadMenuItems();
    } catch (error) {
      console.error('Toggle hatası:', error);
      setErrorMessage(error.message || 'Menü öğesi durumu güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // Dosya validasyonu
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage('Dosya boyutu 5MB\'dan büyük olamaz.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Sadece JPEG, PNG, GIF ve WebP formatları desteklenir.');
      return;
    }

    // Dosyayı state'e kaydet
    setSelectedFile(file);
    setErrorMessage(''); // Hata mesajını temizle

    // Önizleme için
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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
  const activeItems = menuItems.filter(item => item.isAvailable).length;
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
          disabled={loading}
        >
          Ürün Ekle
        </Button>
      </Box>

      {/* QR Menü Linki */}
      <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1, mr: 2 }}>
              {placeId ? (
                <QRCode
                  value={`${window.location.origin}/menu/${placeId}`}
                  size={64}
                />
              ) : (
                <Box sx={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={32} />
                </Box>
              )}
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
              {placeId 
                ? `${window.location.origin}/menu/${placeId}`
                : 'Yükleniyor...'}
            </Typography>
            <Button
              size="small"
              startIcon={<CopyIcon />}
              onClick={() => {
                if (placeId) {
                  navigator.clipboard.writeText(`${window.location.origin}/menu/${placeId}`);
                  setSuccessMessage('Link kopyalandı!');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }
              }}
              disabled={!placeId}
            >
              Kopyala
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && menuItems.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
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
            minWidth: '200px'
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
                  <RestaurantIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  Toplam Ürün
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                {totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Menü ürünleri
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
            minWidth: '200px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, color: 'success.main', fontSize: '1.5rem' }}>
                  <RestaurantIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  Aktif Ürün
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'success.main'
              }}>
                {activeItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Mevcut ürünler
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
            minWidth: '200px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, color: 'error.main', fontSize: '1.5rem' }}>
                  <RestaurantIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  Pasif Ürün
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'error.main'
              }}>
                {inactiveItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Devre dışı ürünler
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
            minWidth: '200px'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '16px !important'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, color: 'info.main', fontSize: '1.5rem' }}>
                  <RestaurantIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}>
                  Kategori
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '2rem',
                textAlign: 'center',
                color: 'info.main'
              }}>
                {categories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                fontSize: '0.875rem',
                lineHeight: 1.3
              }}>
                Menü kategorileri
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kategori İstatistikleri */}
      {categories.length > 0 && (
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
                      label={categoryStats[category] || 0}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Menü Listesi */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Menü Öğeleri
            </Typography>
            {/* Kategori Filtreleme */}
            {categories.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Kategoriye Göre Filtrele</InputLabel>
                <Select
                  value={selectedCategoryFilter}
                  label="Kategoriye Göre Filtrele"
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          {loading && menuItems.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredMenuItems.length === 0 ? (
            <Alert severity="info">
              {selectedCategoryFilter !== 'all' 
                ? 'Seçili kategoride menü öğesi bulunmamaktadır.'
                : 'Henüz menü öğesi bulunmamaktadır. Yeni ürün eklemek için "Ürün Ekle" butonuna tıklayın.'}
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fotoğraf</TableCell>
                    <TableCell>Ürün Adı</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Fiyat</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Açıklama</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMenuItems.map((item) => {
                    const tags = parseTags(item.tags);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 4
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                        <TableCell>
                          <Chip label={item.category} color="primary" size="small" />
                        </TableCell>
                        <TableCell>₺{item.price}</TableCell>
                        <TableCell>
                          {tags.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>{item.description || '-'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={item.isAvailable}
                            onChange={() => handleToggleActive(item)}
                            color="success"
                            disabled={loading}
                          />
                          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                            {item.isAvailable ? 'Aktif' : 'Pasif'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditItem(item)}
                            disabled={loading}
                            title="Düzenle"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteItem(item)}
                            disabled={loading}
                            title="Ürün Sil"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Ürün Ekleme Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => !loading && setAddDialogOpen(false)} 
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
         Yeni Ürün Ekle
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
            disabled={loading}
          />
          <Autocomplete
            freeSolo
            options={categories}
            value={newItem.category}
            onInputChange={(event, newValue) => {
              setNewItem(prev => ({ ...prev, category: newValue }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kategori"
                margin="normal"
                required
                disabled={loading}
                helperText="Yeni kategori yazabilir veya mevcut kategorilerden seçebilirsiniz"
              />
            )}
          />
          <TextField
            fullWidth
            label="Fiyat (₺)"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Tags (virgülle ayrılmış)"
            value={newItem.tags}
            onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
            margin="normal"
            placeholder="örn: vegan,spicy,popular"
            disabled={loading}
            helperText="Ürün etiketlerini virgülle ayırarak yazın"
          />
          <TextField
            fullWidth
            label="Sıralama (Display Order)"
            type="number"
            value={newItem.displayOrder}
            onChange={(e) => setNewItem(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
            margin="normal"
            inputProps={{ min: 0 }}
            disabled={loading}
            helperText="Küçük değerler önce gösterilir"
          />
          
          {/* Fotoğraf Yükleme */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fotoğraf (Opsiyonel)
            </Typography>
            <input
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ display: 'none' }}
              id="add-image-upload-input"
              type="file"
              onChange={(e) => handleFileSelect(e, false)}
            />
            <label htmlFor="add-image-upload-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                disabled={loading}
                startIcon={<ImageIcon />}
              >
                Fotoğraf Seç
              </Button>
            </label>
            
            {/* Önizleme */}
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    const input = document.getElementById('add-image-upload-input');
                    if (input) input.value = '';
                  }}
                  sx={{ mt: 1 }}
                >
                  Fotoğrafı Kaldır
                </Button>
              </Box>
            )}
            
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="body2">
                • Maksimum dosya boyutu: 5MB<br />
                • Desteklenen formatlar: JPEG, PNG, GIF, WebP
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setAddDialogOpen(false);
              setSelectedFile(null);
              setImagePreview(null);
            }} 
            disabled={loading}
            variant="outlined"
          >
            İptal
          </Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disabled={!newItem.name || !newItem.category || !newItem.price || loading}
          >
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ürün Düzenleme Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => !loading && setEditDialogOpen(false)} 
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
          Ürün Düzenle
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
            disabled={loading}
          />
          <Autocomplete
            freeSolo
            options={categories}
            value={newItem.category}
            onInputChange={(event, newValue) => {
              setNewItem(prev => ({ ...prev, category: newValue }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kategori"
                margin="normal"
                required
                disabled={loading}
                helperText="Yeni kategori yazabilir veya mevcut kategorilerden seçebilirsiniz"
              />
            )}
          />
          <TextField
            fullWidth
            label="Fiyat (₺)"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Tags (virgülle ayrılmış)"
            value={newItem.tags}
            onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
            margin="normal"
            placeholder="örn: vegan,spicy,popular"
            disabled={loading}
            helperText="Ürün etiketlerini virgülle ayırarak yazın"
          />
          <TextField
            fullWidth
            label="Sıralama (Display Order)"
            type="number"
            value={newItem.displayOrder}
            onChange={(e) => setNewItem(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
            margin="normal"
            inputProps={{ min: 0 }}
            disabled={loading}
            helperText="Küçük değerler önce gösterilir"
          />
          
          {/* Fotoğraf Yükleme/Güncelleme */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fotoğraf
            </Typography>
            
            {/* Mevcut fotoğraf gösterimi */}
            {selectedItem?.imageUrl && !imagePreview && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mevcut Fotoğraf:
                </Typography>
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={async () => {
                    if (window.confirm('Fotoğrafı silmek istediğinizden emin misiniz?')) {
                      try {
                        await menuService.deleteMenuItemImage(selectedItem.id);
                        await loadMenuItems();
                        setImagePreview(null);
                        setSelectedFile(null);
                        setSuccessMessage('Fotoğraf başarıyla silindi!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (error) {
                        setErrorMessage(error.message || 'Fotoğraf silinirken bir hata oluştu');
                      }
                    }
                  }}
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  Mevcut Fotoğrafı Sil
                </Button>
              </Box>
            )}
            
            <input
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ display: 'none' }}
              id="edit-image-upload-input"
              type="file"
              onChange={(e) => handleFileSelect(e, true)}
            />
            <label htmlFor="edit-image-upload-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                disabled={loading}
                startIcon={<ImageIcon />}
              >
                {selectedItem?.imageUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Ekle'}
              </Button>
            </label>
            
            {/* Yeni fotoğraf önizleme */}
            {imagePreview && selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Yeni Fotoğraf Önizleme:
                </Typography>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedFile(null);
                    // Eğer mevcut fotoğraf varsa onu göster, yoksa null
                    if (selectedItem?.imageUrl) {
                      setImagePreview(selectedItem.imageUrl);
                    } else {
                      setImagePreview(null);
                    }
                    const input = document.getElementById('edit-image-upload-input');
                    if (input) input.value = '';
                  }}
                  sx={{ mt: 1 }}
                >
                  Seçimi İptal Et
                </Button>
              </Box>
            )}
            
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="body2">
                • Maksimum dosya boyutu: 5MB<br />
                • Desteklenen formatlar: JPEG, PNG, GIF, WebP<br />
                • Yeni fotoğraf yüklendiğinde mevcut fotoğraf otomatik olarak silinir
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setEditDialogOpen(false);
              setSelectedItem(null);
              setSelectedFile(null);
              setImagePreview(null);
            }} 
            disabled={loading}
            variant="outlined"
          >
            İptal
          </Button>
          <Button
            onClick={handleUpdateItem}
            variant="contained"
            disabled={!newItem.name || !newItem.category || !newItem.price || loading}
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ürün Silme Onay Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !loading && setDeleteDialogOpen(false)}>
        <DialogTitle>Ürünü Sil</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedItem?.name}</strong> adlı ürünü silmek istediğinizden emin misiniz?
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
            onClick={confirmDeleteItem}
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

export default MenuManagementView;