import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Rating,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  RateReview as ReviewIcon,
  EventNote as ReservationIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function UserManagementView() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Role kontrolü
  useEffect(() => {
    const user = authService.getCurrentUser();
    
    let userRole = user?.role;
    if (!userRole) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          userRole = decoded.role || decoded.authorities?.[0];
        } catch (e) {
          console.error('Token decode hatası:', e);
        }
      }
    }
    
    if (!user || (userRole !== 'ROLE_ADMIN' && userRole !== 'ADMIN')) {
      setErrorMessage('Bu sayfaya erişim için Super Admin yetkisi gereklidir.');
      setIsAuthorized(false);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setIsAuthorized(true);
      loadUsers();
    }
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await adminService.getAllUsers();
      // Sadece USER rolündeki kullanıcıları filtrele
      const regularUsers = data.filter(user => 
        user.role === 'ROLE_USER' || user.role === 'USER'
      );
      setUsers(regularUsers);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setErrorMessage(error.message || 'Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReviews = async (user) => {
    setSelectedUser(user);
    setReviewDialogOpen(true);
    setReviewsLoading(true);
    setUserReviews([]);

    try {
      const reviews = await adminService.getUserReviews(user.id);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setErrorMessage(error.message || 'Yorumlar yüklenirken bir hata oluştu');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedUser(null);
    setUserReviews([]);
  };

  if (!isAuthorized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Kullanıcı Yönetimi
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* İstatistik Kartları */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Kullanıcı
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4ade80', width: 56, height: 56 }}>
                <ReservationIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.reduce((sum, user) => sum + (user.totalReservations || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Rezervasyon
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#f59e0b', width: 56, height: 56 }}>
                <ReviewIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {users.reduce((sum, user) => sum + (user.totalReviews || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Yorum
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Kullanıcı Tablosu */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Kullanıcı Adı</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Toplam Rezervasyon</strong></TableCell>
                  <TableCell align="center"><strong>İptal Edilen</strong></TableCell>
                  <TableCell align="center"><strong>Yorumlar</strong></TableCell>
                  <TableCell align="center"><strong>Durum</strong></TableCell>
                  <TableCell align="center"><strong>İşlemler</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Henüz kayıtlı kullanıcı bulunmamaktadır.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            src={user.profileImageUrl}
                            sx={{ width: 32, height: 32, bgcolor: '#667eea' }}
                          >
                            {user.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          {user.username}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={user.totalReservations || 0} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={user.cancelledReservations || 0} 
                          size="small" 
                          color="error" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={user.totalReviews || 0} 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.active ? 'Aktif' : 'Pasif'}
                          color={user.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewReviews(user)}
                          disabled={!user.totalReviews || user.totalReviews === 0}
                          title="Yorumları Görüntüle"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Yorumlar Modal */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={selectedUser?.profileImageUrl}
              sx={{ bgcolor: '#667eea', width: 48, height: 48 }}
            >
              {selectedUser?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {selectedUser?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ px: 3, py: 2 }}>
          {reviewsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : userReviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Bu kullanıcının henüz yorumu bulunmamaktadır.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {userReviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {review.placeName || 'Mekan Adı'}
                      </Typography>
                      <Rating value={review.rating || 0} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseReviewDialog} variant="outlined">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagementView;
