import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  Rule as RuleIcon,
  Image as ImageIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

function SetupGuideModal({ open, onClose, onNavigate }) {
  const setupSteps = [
    {
      icon: <ImageIcon sx={{ color: '#667eea', fontSize: 40 }} />,
      title: 'Mekan Fotoğrafı',
      description: 'İşletmenizin görselini ekleyin',
      path: '/admin/business-settings',
      action: 'Fotoğraf Ekle',
    },
    {
      icon: <RuleIcon sx={{ color: '#667eea', fontSize: 40 }} />,
      title: 'Rezervasyon Kuralları',
      description: 'Kapasite ve çalışma saatlerini ayarlayın',
      path: '/admin/reservation-rules',
      action: 'Kuralları Ayarla',
    },
  ];

  const handleNavigate = (path) => {
    onNavigate(path);
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          }}
        >
          <CheckIcon sx={{ fontSize: 48, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Hoş Geldiniz! 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary">
          İşletmeniz başarıyla oluşturuldu
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: '#f8f9ff',
            borderLeft: '4px solid #667eea',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            💡 İşletmenizi müşterileriniz için hazır hale getirin
          </Typography>
        </Paper>

        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Lütfen aşağıdaki adımları tamamlayın:
        </Typography>

        <List sx={{ p: 0 }}>
          {setupSteps.map((step, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ mr: 2 }}>{step.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate(step.path)}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
              >
                {step.action}
              </Button>
            </Paper>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
        >
          Daha Sonra
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SetupGuideModal;
