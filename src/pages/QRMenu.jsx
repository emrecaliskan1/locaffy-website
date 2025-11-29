
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    RestaurantMenu as MenuIcon,
    Info as InfoIcon,
    AccessTime as TimeIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import menuService from '../services/menuService';
import PlaceLogo from '../components/PlaceLogo';

function QRMenu() {
    const { businessId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessData, setBusinessData] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const id = parseInt(businessId);
                if (isNaN(id)) {
                    throw new Error("Geçersiz işletme ID'si");
                }

                const data = await menuService.getPlaceMenu(id);
                
                setBusinessData({
                    name: data.placeName,
                    description: data.description || "En lezzetli menüler",
                    coverImage: data.mainImageUrl || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
                    // mainImageUrl hem logo hem banner için kullanılabilir (backend'den geliyor)
                    logo: data.mainImageUrl || null,
                    address: data.address || "Adres bilgisi",
                    phone: data.phoneNumber || "Telefon bilgisi",
                    workingHours: data.openingHours || "09:00 - 22:00"
                });
                setMenuData(data);
                setFilteredItems(data.allItems || []);
            } catch (err) {
                console.error("Menü yüklenirken hata:", err);
                setError("Menü yüklenemedi. Lütfen tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        if (businessId) {
            fetchMenu();
        }
    }, [businessId]);

    // Tags'leri parse et (virgülle ayrılmış string'den array'e)
    const parseTags = (tagsString) => {
        if (!tagsString) return [];
        return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    };

    useEffect(() => {
        if (!menuData) return;

        let result = [];

        if (activeCategory === 'Tümü') {
            result = menuData.allItems || [];
        } else {
            result = menuData.menuByCategory[activeCategory] || [];
        }

        // Sadece aktif (isAvailable: true) ürünleri göster
        result = result.filter(item => item.isAvailable !== false);

        // Display order'a göre sırala (küçük değerler önce)
        result.sort((a, b) => {
            const orderA = a.displayOrder || 0;
            const orderB = b.displayOrder || 0;
            return orderA - orderB;
        });

        // Arama filtresi
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                const nameMatch = item.name?.toLowerCase().includes(query);
                const descMatch = item.description?.toLowerCase().includes(query);
                // Tags'lerde de ara
                const tags = parseTags(item.tags);
                const tagsMatch = tags.some(tag => tag.toLowerCase().includes(query));
                return nameMatch || descMatch || tagsMatch;
            });
        }

        setFilteredItems(result);
    }, [activeCategory, searchQuery, menuData]);

    const handleCategoryChange = (event, newValue) => {
        setActiveCategory(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!businessData) return null;

    const categories = ['Tümü', ...Object.keys(menuData?.menuByCategory || {})];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
            {/* Custom Header - Only Locaffy */}
            <Box sx={{
                bgcolor: 'white',
                py: 2,
                px: 3,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 1100
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
                    Locaffy
                </Typography>
            </Box>

            {/* Header Image & Logo */}
            <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.300' }}>
                <img
                    src={businessData.coverImage}
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        p: 0.5,
                        boxShadow: 3,
                        zIndex: 1
                    }}
                >
                    <PlaceLogo logoUrl={businessData.logo} size={80} />
                </Box>
            </Box>

            {/* Business Info */}
            <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {businessData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {businessData.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<TimeIcon />}
                        label={businessData.workingHours}
                        variant="outlined"
                        size="small"
                    />
                    <Chip
                        icon={<InfoIcon />}
                        label="Bilgi"
                        onClick={() => setShowInfo(!showInfo)}
                        color={showInfo ? "primary" : "default"}
                        size="small"
                    />
                </Box>

                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <Card variant="outlined" sx={{ mb: 2, textAlign: 'left' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationIcon color="action" sx={{ mr: 1 }} />
                                        <Typography variant="body2">{businessData.address}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                                        <Typography variant="body2">{businessData.phone}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>

            {/* Search & Categories */}
            <Container maxWidth="md" sx={{ position: 'sticky', top: 64, zIndex: 10, bgcolor: '#f5f5f5', pb: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Menüde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { bgcolor: 'background.paper', borderRadius: 2 }
                    }}
                    sx={{ mb: 2 }}
                />

                <Tabs
                    value={activeCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        '& .MuiTab-root': { minHeight: 48 }
                    }}
                >
                    {categories.map((category) => (
                        <Tab key={category} label={category} value={category} />
                    ))}
                </Tabs>
            </Container>

            {/* Menu Items */}
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    {filteredItems.map((item) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ display: 'flex', borderRadius: 3, overflow: 'hidden', height: 120 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 120, objectFit: 'cover' }}
                                        image={item.imageUrl || "https://via.placeholder.com/150"}
                                        alt={item.name}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography variant="subtitle1" fontWeight="bold" component="div">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                                ₺{item.price}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            flex: 1
                                        }}>
                                            {item.description || ''}
                                        </Typography>
                                        {/* Tags gösterimi */}
                                        {item.tags && parseTags(item.tags).length > 0 && (
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                                {parseTags(item.tags).map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        color={tag.toLowerCase() === 'popular' ? 'warning' : 'default'}
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {filteredItems.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <MenuIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">
                            Aradığınız kriterlere uygun ürün bulunamadı.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default QRMenu;
