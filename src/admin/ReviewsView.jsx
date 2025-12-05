import React, { useState, useEffect } from 'react';
import {
    Box,
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
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Grid,
    Card,
    CardContent,
    Rating,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterListIcon,
    Star as StarIcon,
    Comment as CommentIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import { reviewService } from '../services/reviewService';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return dateString;
    }
};

// Puan renklendirme
const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
};

function ReviewsView() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [placeFilter, setPlaceFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [paginationData, setPaginationData] = useState({
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const [uniquePlaces, setUniquePlaces] = useState([]);

    useEffect(() => {
        loadReviews();
    }, [page, rowsPerPage, orderBy, order]);

    useEffect(() => {
        filterAndSearchReviews();
    }, [reviews, searchTerm, placeFilter, ratingFilter, dateFilter]);

    const loadReviews = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const params = {
                page: page,
                size: rowsPerPage,
                sort: `${orderBy},${order}`,
            };

            const data = await reviewService.getAllReviews(params);

            if (data.content) {
                setReviews(data.content);
                setPaginationData({
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    size: data.size || rowsPerPage,
                    number: data.number || page,
                });
            } else {
                setReviews(Array.isArray(data) ? data : []);
                setPaginationData({
                    totalElements: Array.isArray(data) ? data.length : 0,
                    totalPages: 1,
                    size: rowsPerPage,
                    number: page,
                });
            }

            const allReviews = data.content || (Array.isArray(data) ? data : []);
            const places = [...new Set(allReviews.map((r) => r.placeId))];

            setUniquePlaces(places);
        } catch (error) {
            setErrorMessage(error.message || 'Yorumlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSearchReviews = () => {
        let filtered = [...reviews];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (review) =>
                    review.comment?.toLowerCase().includes(searchLower) ||
                    review.username?.toLowerCase().includes(searchLower) ||
                    review.id?.toString().includes(searchLower) ||
                    review.placeId?.toString().includes(searchLower)
            );
        }

        if (placeFilter !== 'all') {
            filtered = filtered.filter((review) => review.placeId?.toString() === placeFilter);
        }

        if (ratingFilter !== 'all') {
            const ratingValue = parseInt(ratingFilter);
            filtered = filtered.filter((review) => review.rating === ratingValue);
        }

        // Tarih filtresi (son 7 gün, son 30 gün, vb.)
        if (dateFilter !== 'all') {
            const now = new Date();
            let filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setDate(now.getDate() - 30);
                    break;
                default:
                    filterDate = null;
            }

            if (filterDate) {
                filtered = filtered.filter((review) => {
                    const reviewDate = new Date(review.createdAt);
                    return reviewDate >= filterDate;
                });
            }
        }

        setFilteredReviews(filtered);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (review) => {
        setSelectedReview(review);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedReview) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await reviewService.deleteReview(selectedReview.id);
            setSuccessMessage('Yorum başarıyla silindi!');
            setDeleteDialogOpen(false);
            setSelectedReview(null);
            loadReviews();
        } catch (error) {
            setErrorMessage(error.message || 'Yorum silinirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (review) => {
        setSelectedReview(review);
        setDetailDialogOpen(true);
    };

    const handlePlaceClick = (placeId) => {
        console.log('Place ID:', placeId);
    };

    const handleUserClick = (userId) => {
        console.log('User ID:', userId);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Yorumlar
            </Typography>

            {/* Hata ve başarı mesajları */}
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
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
                                <Box sx={{ mr: 2, color: 'primary.main', fontSize: '1.5rem' }}>
                                    <CommentIcon />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    Toplam Yorum
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                fontSize: '2rem',
                                textAlign: 'center'
                            }}>
                                {paginationData.totalElements || reviews.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                lineHeight: 1.3
                            }}>
                                Tüm yorumlar
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
                                <Box sx={{ mr: 2, color: 'warning.main', fontSize: '1.5rem' }}>
                                    <StarIcon />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    Ortalama Puan
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                fontSize: '2rem',
                                textAlign: 'center'
                            }}>
                                {reviews.length > 0
                                    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
                                    : '0.0'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                lineHeight: 1.3
                            }}>
                                5 üzerinden
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
                                <Box sx={{ mr: 2, color: 'success.main', fontSize: '1.5rem' }}>
                                    <ThumbUpIcon />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    5 Yıldız
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                fontSize: '2rem',
                                textAlign: 'center'
                            }}>
                                {reviews.filter((r) => r.rating === 5).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                lineHeight: 1.3
                            }}>
                                Mükemmel yorumlar
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
                                <Box sx={{ mr: 2, color: 'error.main', fontSize: '1.5rem' }}>
                                    <ThumbDownIcon />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    1-2 Yıldız
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                fontSize: '2rem',
                                textAlign: 'center'
                            }}>
                                {reviews.filter((r) => r.rating <= 2).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                lineHeight: 1.3
                            }}>
                                Düşük puanlı yorumlar
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtreleme ve Arama Toolbar */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Toolbar sx={{ pl: 0, pr: 0, flexWrap: 'wrap', gap: 2 }}>
                    {/* Arama */}
                    <TextField
                        placeholder="Ara (yorum, kullanıcı, ID...)"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 250, flexGrow: 1 }}
                    />

                    {/* Place Filtresi */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Mekan</InputLabel>
                        <Select
                            value={placeFilter}
                            label="Mekan"
                            onChange={(e) => setPlaceFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            {uniquePlaces.map((placeId) => (
                                <MenuItem key={placeId} value={placeId.toString()}>
                                    Mekan #{placeId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Rating Filtresi */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Puan</InputLabel>
                        <Select
                            value={ratingFilter}
                            label="Puan"
                            onChange={(e) => setRatingFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            <MenuItem value="5">5 Yıldız</MenuItem>
                            <MenuItem value="4">4 Yıldız</MenuItem>
                            <MenuItem value="3">3 Yıldız</MenuItem>
                            <MenuItem value="2">2 Yıldız</MenuItem>
                            <MenuItem value="1">1 Yıldız</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Tarih Filtresi */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Tarih</InputLabel>
                        <Select
                            value={dateFilter}
                            label="Tarih"
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            <MenuItem value="today">Bugün</MenuItem>
                            <MenuItem value="week">Son 7 Gün</MenuItem>
                            <MenuItem value="month">Son 30 Gün</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>
            </Paper>

            {/* Yorumlar Tablosu */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : filteredReviews.length === 0 ? (
                <Alert severity="info">
                    {reviews.length === 0
                        ? 'Henüz yorum bulunmamaktadır.'
                        : 'Arama kriterlerinize uygun yorum bulunamadı.'}
                </Alert>
            ) : (
                <>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? order : 'asc'}
                                            onClick={() => handleSort('id')}
                                        >
                                            ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'username'}
                                            direction={orderBy === 'username' ? order : 'asc'}
                                            onClick={() => handleSort('username')}
                                        >
                                            Kullanıcı
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Mekan</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'rating'}
                                            direction={orderBy === 'rating' ? order : 'asc'}
                                            onClick={() => handleSort('rating')}
                                        >
                                            Puan
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Yorum</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'createdAt'}
                                            direction={orderBy === 'createdAt' ? order : 'asc'}
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Oluşturulma Tarihi
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'updatedAt'}
                                            direction={orderBy === 'updatedAt' ? order : 'asc'}
                                            onClick={() => handleSort('updatedAt')}
                                        >
                                            Güncellenme Tarihi
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center">İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReviews.map((review) => (
                                    <TableRow key={review.id} hover>
                                        <TableCell>{review.id}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                                onClick={() => handleUserClick(review.userId)}
                                            >
                                                {review.username || `Kullanıcı #${review.userId}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                                onClick={() => handlePlaceClick(review.placeId)}
                                            >
                                                Mekan #{review.placeId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Rating value={review.rating || 0} readOnly size="small" />
                                                <Chip
                                                    label={review.rating || 0}
                                                    color={getRatingColor(review.rating)}
                                                    size="small"
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                title={review.comment}
                                            >
                                                {review.comment || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatDate(review.createdAt)}</TableCell>
                                        <TableCell>
                                            {review.updatedAt ? formatDate(review.updatedAt) : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleViewDetails(review)}
                                                title="Detayları Görüntüle"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(review)}
                                                title="Sil"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Sayfalama */}
                    <TablePagination
                        component="div"
                        count={paginationData.totalElements || filteredReviews.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Sayfa başına:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} / ${count !== -1 ? count : `~${to}`}`
                        }
                    />
                </>
            )}

            {/* Silme Onay Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="delete-dialog-title" sx={{
                    background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    py: 3
                }}>
                    Yorumu Sil
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {/* Uyarı Mesajı */}
                        <Box sx={{ 
                            p: 2,
                            backgroundColor: '#fff3cd',
                            borderRadius: 1,
                            borderLeft: '4px solid #f57c00',
                            mb: 3
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#8b4513' }}>
                                ⚠️ Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </Typography>
                        </Box>

                        {/* Üst Kısım - ID Bilgileri */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            flexWrap: 'wrap', 
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                            mb: 3 
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                <strong>Yorum ID:</strong> {selectedReview?.id}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                <strong>Kullanıcı:</strong> {selectedReview?.username}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                <strong>Puan:</strong> {selectedReview?.rating}/5
                            </Typography>
                        </Box>

                        {/* Orta Kısım - Yorum İçeriği */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                Silinecek Yorum
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    whiteSpace: 'pre-wrap',
                                    p: 3,
                                    backgroundColor: '#ffebee',
                                    borderRadius: 1,
                                    borderLeft: '4px solid #d32f2f',
                                    fontSize: '16px',
                                    lineHeight: 1.6
                                }}
                            >
                                {selectedReview?.comment || 'Yorum bulunmuyor'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        size="large"
                        sx={{ minWidth: '120px' }}
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        size="large"
                        sx={{ minWidth: '120px', fontWeight: 'bold' }}
                    >
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detay Dialog */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                aria-labelledby="detail-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    py: 3
                }}>
                    Yorum Detayları
                </DialogTitle>
                <DialogContent>
                    {selectedReview && (
                        <Box sx={{ mt: 1 }}>
                            {/* Üst Kısım - ID Bilgileri Tek Sırada */}
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 3, 
                                flexWrap: 'wrap', 
                                p: 2,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 1,
                                mb: 3 
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    <strong>Yorum ID:</strong> {selectedReview.id}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    <strong>Mekan ID:</strong> 
                                    <span 
                                        style={{ cursor: 'pointer', color: '#667eea', marginLeft: '4px', fontWeight: 'bold' }}
                                        onClick={() => handlePlaceClick(selectedReview.placeId)}
                                    >
                                        {selectedReview.placeId}
                                    </span>
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    <strong>Kullanıcı:</strong> 
                                    <span 
                                        style={{ cursor: 'pointer', color: '#667eea', marginLeft: '4px', fontWeight: 'bold' }}
                                        onClick={() => handleUserClick(selectedReview.userId)}
                                    >
                                        {selectedReview.username} (ID: {selectedReview.userId})
                                    </span>
                                </Typography>
                            </Box>

                            {/* Orta Kısım - Yıldız ve Yorum */}
                            <Box sx={{ mb: 3 }}>
                                {/* Verilen Puan */}
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                    Verilen Puan
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                                    <Rating value={selectedReview.rating || 0} readOnly size="large" />
                                    <Chip
                                        label={`${selectedReview.rating}/5`}
                                        color={getRatingColor(selectedReview.rating)}
                                        size="medium"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                                
                                {/* Yorum Metni */}
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                    Yorum Metni
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        whiteSpace: 'pre-wrap',
                                        p: 3,
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: 1,
                                        borderLeft: '4px solid #667eea',
                                        fontSize: '16px',
                                        lineHeight: 1.6,
                                        mb: 3
                                    }}
                                >
                                    {selectedReview.comment || 'Yorum bulunmuyor'}
                                </Typography>
                            </Box>

                            {/* Alt Kısım - Tarihler Yan Yana */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                                        Oluşturulma Tarihi
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        p: 2,
                                        backgroundColor: '#e8f5e8',
                                        borderRadius: 1,
                                        fontWeight: 'medium'
                                    }}>
                                        {formatDate(selectedReview.createdAt)}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                                        Güncellenme Tarihi
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        p: 2,
                                        backgroundColor: '#fff3cd',
                                        borderRadius: 1,
                                        fontWeight: 'medium'
                                    }}>
                                        {selectedReview.updatedAt ? formatDate(selectedReview.updatedAt) : 'Güncellenmemiş'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ReviewsView;