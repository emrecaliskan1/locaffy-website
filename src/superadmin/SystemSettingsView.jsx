import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function SystemSettingsView() {
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: 1,
      name: 'Temel',
      price: 299,
      duration: 'Aylık',
      features: ['10 Fotoğraf', 'Temel Destek', 'Rezervasyon Yönetimi'],
      isActive: true,
    },
    {
      id: 2,
      name: 'Standart',
      price: 499,
      duration: 'Aylık',
      features: ['30 Fotoğraf', 'Öncelikli Destek', 'Rezervasyon Yönetimi', 'Analitik Raporlar'],
      isActive: true,
    },
    {
      id: 3,
      name: 'Premium',
      price: 899,
      duration: 'Aylık',
      features: ['Sınırsız Fotoğraf', '7/24 Destek', 'Rezervasyon Yönetimi', 'Detaylı Analitik', 'Öne Çıkan İlan'],
      isActive: true,
    },
  ]);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    duration: 'Aylık',
    features: '',
    isActive: true,
  });

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Hoşgeldiniz',
      subject: 'Locaffy\'e Hoş Geldiniz!',
      type: 'welcome',
      isActive: true,
    },
    {
      id: 2,
      name: 'Rezervasyon Onayı',
      subject: 'Rezervasyonunuz Onaylandı',
      type: 'reservation_confirmation',
      isActive: true,
    },
    {
      id: 3,
      name: 'Rezervasyon İptali',
      subject: 'Rezervasyonunuz İptal Edildi',
      type: 'reservation_cancellation',
      isActive: true,
    },
    {
      id: 4,
      name: 'İşletme Onayı',
      subject: 'İşletme Başvurunuz Onaylandı',
      type: 'business_approval',
      isActive: true,
    },
  ]);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    body: '',
    isActive: true,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abonelik Paketi İşlemleri
  const handleOpenPlanDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features.join(', '),
        isActive: plan.isActive,
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        name: '',
        price: '',
        duration: 'Aylık',
        features: '',
        isActive: true,
      });
    }
    setPlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name || !planForm.price) {
      setErrorMessage('Paket adı ve fiyat zorunludur');
      return;
    }

    const featuresArray = planForm.features.split(',').map(f => f.trim()).filter(f => f);

    if (editingPlan) {
      setSubscriptionPlans(subscriptionPlans.map(plan =>
        plan.id === editingPlan.id
          ? { ...plan, ...planForm, features: featuresArray, price: parseFloat(planForm.price) }
          : plan
      ));
      setSuccessMessage('Abonelik paketi güncellendi');
    } else {
      const newPlan = {
        id: Math.max(...subscriptionPlans.map(p => p.id), 0) + 1,
        ...planForm,
        features: featuresArray,
        price: parseFloat(planForm.price),
      };
      setSubscriptionPlans([...subscriptionPlans, newPlan]);
      setSuccessMessage('Yeni abonelik paketi eklendi');
    }

    setPlanDialogOpen(false);
  };

  const handleDeletePlan = (planId) => {
    setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== planId));
    setSuccessMessage('Abonelik paketi silindi');
  };

  // Email Şablon İşlemleri
  const handleOpenTemplateDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        subject: template.subject,
        body: template.body || '',
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        name: '',
        subject: '',
        body: '',
        isActive: true,
      });
    }
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.subject) {
      setErrorMessage('Şablon adı ve konu zorunludur');
      return;
    }

    if (editingTemplate) {
      setEmailTemplates(emailTemplates.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...templateForm }
          : template
      ));
      setSuccessMessage('Email şablonu güncellendi');
    } else {
      const newTemplate = {
        id: Math.max(...emailTemplates.map(t => t.id), 0) + 1,
        ...templateForm,
        type: templateForm.name.toLowerCase().replace(/\s+/g, '_'),
      };
      setEmailTemplates([...emailTemplates, newTemplate]);
      setSuccessMessage('Yeni email şablonu eklendi');
    }

    setTemplateDialogOpen(false);
  };

  const handleDeleteTemplate = (templateId) => {
    setEmailTemplates(emailTemplates.filter(template => template.id !== templateId));
    setSuccessMessage('Email şablonu silindi');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Sistem Ayarları
      </Typography>

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

      <Card>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Abonelik Paketleri" />
          <Tab label="Email Şablonları" />
        </Tabs>

        {/* Abonelik Paketleri */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paket Adı</TableCell>
                  <TableCell>Fiyat</TableCell>
                  <TableCell>Süre</TableCell>
                  <TableCell>Özellikler</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>₺{plan.price}</TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {plan.features.map((feature, idx) => (
                          <Chip key={idx} label={feature} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={plan.isActive ? 'Aktif' : 'Pasif'}
                        color={plan.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenPlanDialog(plan)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeletePlan(plan.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenPlanDialog()}
            >
              Yeni Paket Ekle
            </Button>
          </Box>
        </TabPanel>

        {/* Email Şablonları */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Şablon Adı</TableCell>
                  <TableCell>Konu</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell>
                      <Chip label={template.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.isActive ? 'Aktif' : 'Pasif'}
                        color={template.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenTemplateDialog(template)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteTemplate(template.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mr: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTemplateDialog()}
            >
              Yeni Şablon Ekle
            </Button>
          </Box>
        </TabPanel>
      </Card>

      {/* Abonelik Paketi Dialog */}
      <Dialog 
        open={planDialogOpen} 
        onClose={() => setPlanDialogOpen(false)} 
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
          {editingPlan ? 'Abonelik Paketini Düzenle' : 'Yeni Abonelik Paketi'}
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Paket Adı"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fiyat (₺)"
                type="number"
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Süre"
                value={planForm.duration}
                onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Özellikler (virgülle ayırın)"
                multiline
                rows={3}
                value={planForm.features}
                onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                placeholder="Örnek: 10 Fotoğraf, Temel Destek, Rezervasyon Yönetimi"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                  />
                }
                label="Aktif"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setPlanDialogOpen(false)} variant="outlined">İptal</Button>
          <Button variant="contained" onClick={handleSavePlan}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Şablon Dialog */}
      <Dialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
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
          {editingTemplate ? 'Email Şablonunu Düzenle' : 'Yeni Email Şablonu'}
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Şablon Adı"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Konu"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="İçerik"
                multiline
                rows={8}
                value={templateForm.body}
                onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                placeholder="Email içeriğini buraya yazın..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={templateForm.isActive}
                    onChange={(e) => setTemplateForm({ ...templateForm, isActive: e.target.checked })}
                  />
                }
                label="Aktif"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setTemplateDialogOpen(false)} variant="outlined">İptal</Button>
          <Button variant="contained" onClick={handleSaveTemplate}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SystemSettingsView;
