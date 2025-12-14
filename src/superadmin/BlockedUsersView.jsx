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
    Button,
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    Grid,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    Block as BlockIcon,
    PersonOff as PersonOffIcon,
    LockOpen as LockOpenIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';

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

function BlockedUsersView() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [blockedUsers, searchTerm]);

    const loadBlockedUsers = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const data = await adminService.getBlockedUsers();
            setBlockedUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setErrorMessage(error.message || 'Engellenen kullanıcılar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...blockedUsers];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.username?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.id?.toString().includes(searchLower) ||
                    user.blockedFromReservationsReason?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredUsers(filtered);
    };

    const handleUnblockClick = (user) => {
        setSelectedUser(user);
        setUnblockDialogOpen(true);
    };

    const handleUnblockConfirm = async () => {
        if (!selectedUser) return;

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await adminService.unblockUser(selectedUser.id);
            setSuccessMessage(`${selectedUser.username || selectedUser.email} kullanıcısının engeli başarıyla kaldırıldı!`);
            setUnblockDialogOpen(false);
            setSelectedUser(null);
            loadBlockedUsers();
        } catch (error) {
            setErrorMessage(error.message || 'Kullanıcı engeli kaldırılırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Engellenen Kullanıcılar
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
                <Grid item xs={12} sm={6} md={4}>
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
                                    <PersonOffIcon />
                                </Box>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    lineHeight: 1.2
                                }}>
                                    Engellenen Kullanıcı
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                fontSize: '2rem',
                                textAlign: 'center'
                            }}>
                                {blockedUsers.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                lineHeight: 1.3
                            }}>
                                Toplam engellenen
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Arama */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    placeholder="Ara (kullanıcı adı, email, ID...)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Engellenen Kullanıcılar Tablosu */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : filteredUsers.length === 0 ? (
                <Alert severity="info">
                    {blockedUsers.length === 0
                        ? 'Henüz engellenen kullanıcı bulunmamaktadır.'
                        : 'Arama kriterlerinize uygun kullanıcı bulunamadı.'}
                </Alert>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Kullanıcı Adı</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Engellenme Tarihi</TableCell>
                                <TableCell>Engellenme Nedeni</TableCell>
                                <TableCell>Toplam Rezervasyon</TableCell>
                                <TableCell>İptal Edilen</TableCell>
                                <TableCell align="center">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {user.username || '-'}
                                    </TableCell>
                                    <TableCell>{user.email || '-'}</TableCell>
                                    <TableCell>
                                        {user.blockedFromReservationsAt
                                            ? formatDate(user.blockedFromReservationsAt)
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ maxWidth: 400 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                title={user.blockedFromReservationsReason || '-'}
                                            >
                                                {user.blockedFromReservationsReason || '-'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.totalReservations || 0}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.cancelledReservations || 0}
                                            color="error"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            startIcon={<LockOpenIcon />}
                                            onClick={() => handleUnblockClick(user)}
                                        >
                                            Engeli Kaldır
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Engeli Kaldır Onay Dialog */}
            <Dialog
                open={unblockDialogOpen}
                onClose={() => setUnblockDialogOpen(false)}
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
                    Kullanıcı Engelini Kaldır
                </DialogTitle>
                
                <Divider />
                
                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Bu kullanıcının rezervasyon engelini kaldırmak istediğinizden emin misiniz?
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Kullanıcı ID:</strong> {selectedUser?.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Kullanıcı Adı:</strong> {selectedUser?.username || '-'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Email:</strong> {selectedUser?.email || '-'}
                            </Typography>
                            {selectedUser?.blockedFromReservationsAt && (
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Engellenme Tarihi:</strong>{' '}
                                    {formatDate(selectedUser.blockedFromReservationsAt)}
                                </Typography>
                            )}
                        </Box>

                        {selectedUser?.blockedFromReservationsReason && (
                            <>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                                    Engellenme Nedeni:
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        whiteSpace: 'pre-wrap',
                                        p: 2,
                                        backgroundColor: 'grey.100',
                                        borderRadius: 1,
                                    }}
                                >
                                    {selectedUser.blockedFromReservationsReason}
                                </Typography>
                            </>
                        )}

                        <Alert severity="info" sx={{ mt: 2 }}>
                            Bu işlemden sonra kullanıcı tekrar rezervasyon oluşturabilecektir.
                        </Alert>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={() => setUnblockDialogOpen(false)}
                        variant="outlined"
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={handleUnblockConfirm} 
                        color="success" 
                        variant="contained"
                        startIcon={<LockOpenIcon />}
                    >
                        Engeli Kaldır
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BlockedUsersView;

