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
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Toplam Yorum
                            </Typography>
                            <Typography variant="h5" component="div">
                                {paginationData.totalElements || reviews.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Ortalama Puan
                            </Typography>
                            <Typography variant="h5" component="div">
                                {reviews.length > 0
                                    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
                                    : '0.0'}
                                <StarIcon sx={{ fontSize: 20, verticalAlign: 'middle', ml: 0.5 }} />
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                5 Yıldız
                            </Typography>
                            <Typography variant="h5" component="div">
                                {reviews.filter((r) => r.rating === 5).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                1-2 Yıldız
                            </Typography>
                            <Typography variant="h5" component="div">
                                {reviews.filter((r) => r.rating <= 2).length}
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
            >
                <DialogTitle id="delete-dialog-title">Yorumu Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Yorum ID: {selectedReview?.id}
                            </Typography>
                            <Typography variant="body2">
                                Kullanıcı: {selectedReview?.username}
                            </Typography>
                            <Typography variant="body2">
                                Puan: {selectedReview?.rating}/5
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {selectedReview?.comment}
                            </Typography>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detay Dialog */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                aria-labelledby="detail-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="detail-dialog-title">Yorum Detayları</DialogTitle>
                <DialogContent>
                    {selectedReview && (
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Yorum ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedReview.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Mekan ID
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: 2, cursor: 'pointer', color: 'primary.main' }}
                                        onClick={() => handlePlaceClick(selectedReview.placeId)}
                                    >
                                        {selectedReview.placeId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Kullanıcı ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedReview.userId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Kullanıcı Adı
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: 2, cursor: 'pointer', color: 'primary.main' }}
                                        onClick={() => handleUserClick(selectedReview.userId)}
                                    >
                                        {selectedReview.username}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Puan
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                        <Rating value={selectedReview.rating || 0} readOnly />
                                        <Chip
                                            label={`${selectedReview.rating}/5`}
                                            color={getRatingColor(selectedReview.rating)}
                                            size="small"
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Yorum Metni
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                                        {selectedReview.comment || '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Oluşturulma Tarihi
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {formatDate(selectedReview.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Güncellenme Tarihi
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedReview.updatedAt ? formatDate(selectedReview.updatedAt) : '-'}
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