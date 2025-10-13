import React, { useState } from 'react';
import {
  Box,
  Grid,
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
  TextField,
  Alert,
  Divider,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const mockApplications = [
  {
    id: 1,
    businessName: 'Lezzet Durağı',
    ownerName: 'Ahmet Yılmaz',
    taxNumber: '1234567890',
    email: 'ahmet@lezzetduragi.com',
    phone: '+90 212 555 0123',
    address: 'Kadıköy, İstanbul',
    businessType: 'Restoran',
    capacity: 50,
    applicationDate: '2024-01-15',
    status: 'Beklemede',
    documents: ['Kimlik Fotokopisi', 'İşletme Belgesi', 'Vergi Levhası'],
    description: 'Geleneksel Türk mutfağı sunan aile işletmesi',
  },
  {
    id: 2,
    businessName: 'Gurme Restoran',
    ownerName: 'Fatma Demir',
    taxNumber: '0987654321',
    email: 'fatma@gurmerestoran.com',
    phone: '+90 312 555 0456',
    address: 'Çankaya, Ankara',
    businessType: 'Restoran',
    capacity: 80,
    applicationDate: '2024-02-20',
    status: 'Beklemede',
    documents: ['Kimlik Fotokopisi', 'İşletme Belgesi'],
    description: 'Modern mutfak ve özel menüler',
  },
  {
    id: 3,
    businessName: 'Tatlı Köşe',
    ownerName: 'Mehmet Kaya',
    taxNumber: '1122334455',
    email: 'mehmet@tatlikose.com',
    phone: '+90 232 555 0789',
    address: 'Konak, İzmir',
    businessType: 'Cafe',
    capacity: 30,
    applicationDate: '2024-01-08',
    status: 'Onaylandı',
    documents: ['Kimlik Fotokopisi', 'İşletme Belgesi', 'Vergi Levhası'],
    description: 'Ev yapımı tatlılar ve kahve',
  },
  {
    id: 4,
    businessName: 'Kahve Evi',
    ownerName: 'Ayşe Özkan',
    taxNumber: '5566778899',
    email: 'ayse@kahveevi.com',
    phone: '+90 224 555 0321',
    address: 'Osmangazi, Bursa',
    businessType: 'Cafe',
    capacity: 25,
    applicationDate: '2024-03-10',
    status: 'Reddedildi',
    documents: ['Kimlik Fotokopisi'],
    description: 'Özel kahve çeşitleri ve atıştırmalıklar',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Beklemede':
      return 'warning';
    case 'Onaylandı':
      return 'success';
    case 'Reddedildi':
      return 'error';
    default:
      return 'default';
  }
};

function ApplicationManagementView() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleApprove = (application) => {
    setSelectedApplication(application);
    setApprovalDialogOpen(true);
  };

  const handleReject = (application) => {
    setSelectedApplication(application);
    setRejectionDialogOpen(true);
  };

  const confirmApproval = () => {
    if (selectedApplication) {
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'Onaylandı' }
          : app
      ));
      setApprovalDialogOpen(false);
      setSelectedApplication(null);
      setSuccessMessage('Başvuru başarıyla onaylandı! İşletme hesabı oluşturuldu.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const confirmRejection = () => {
    if (selectedApplication) {
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'Reddedildi', rejectionReason }
          : app
      ));
      setRejectionDialogOpen(false);
      setSelectedApplication(null);
      setRejectionReason('');
      setSuccessMessage('Başvuru reddedildi.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'Beklemede').length;
    const approved = applications.filter(app => app.status === 'Onaylandı').length;
    const rejected = applications.filter(app => app.status === 'Reddedildi').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getApplicationStats();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Başvuru Yönetimi
      </Typography>

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
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bekleyen Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onaylanan Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reddedilen Başvuru
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Başvuru Listesi */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            İşletme Başvuruları
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>İşletme Adı</TableCell>
                  <TableCell>İşletme Sahibi</TableCell>
                  <TableCell>İşletme Türü</TableCell>
                  <TableCell>Kapasite</TableCell>
                  <TableCell>Başvuru Tarihi</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{application.businessName}</TableCell>
                    <TableCell>{application.ownerName}</TableCell>
                    <TableCell>{application.businessType}</TableCell>
                    <TableCell>{application.capacity} kişi</TableCell>
                    <TableCell>{application.applicationDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={application.status}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewDetails(application)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      {application.status === 'Beklemede' && (
                        <>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleApprove(application)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleReject(application)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Başvuru Detay Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Başvuru Detayları</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      İşletme Bilgileri
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.businessName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.ownerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold' }}>
                        Vergi No:
                      </Typography>
                      <Typography variant="body1">{selectedApplication.taxNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">{selectedApplication.address}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      İşletme Detayları
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>İşletme Türü:</strong> {selectedApplication.businessType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Kapasite:</strong> {selectedApplication.capacity} kişi
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Başvuru Tarihi:</strong> {selectedApplication.applicationDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Durum:</strong> 
                      <Chip 
                        label={selectedApplication.status} 
                        color={getStatusColor(selectedApplication.status)} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Açıklama
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedApplication.description}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Yüklenen Belgeler
                    </Typography>
                    {selectedApplication.documents.map((doc, index) => (
                      <Chip 
                        key={index}
                        label={doc} 
                        variant="outlined" 
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
          {selectedApplication?.status === 'Beklemede' && (
            <>
              <Button 
                onClick={() => handleApprove(selectedApplication)} 
                variant="contained" 
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Onayla
              </Button>
              <Button 
                onClick={() => handleReject(selectedApplication)} 
                variant="contained" 
                color="error"
                startIcon={<CancelIcon />}
              >
                Reddet
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Onay Dialog */}
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)}>
        <DialogTitle>Başvuruyu Onayla</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedApplication?.businessName}</strong> başvurusunu onaylamak istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Onaylandığında işletme için hesap oluşturulacak ve giriş bilgileri email ile gönderilecektir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmApproval} variant="contained" color="success">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Red Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Başvuruyu Reddet</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>{selectedApplication?.businessName}</strong> başvurusunu reddetmek istediğinizden emin misiniz?
          </Typography>
          <TextField
            fullWidth
            label="Red Sebebi"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Red sebebini açıklayın..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={confirmRejection} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Reddet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ApplicationManagementView;

