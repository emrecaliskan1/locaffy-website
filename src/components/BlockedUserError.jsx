import React from 'react';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Typography,
    Link,
} from '@mui/material';
import {
    Block as BlockIcon,
    ContactMail as ContactMailIcon,
    Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Engellenen kullanıcılar için özel hata mesajı bileşeni
 * 
 * Kullanım:
 * ```jsx
 * try {
 *   await reservationService.createReservation(data);
 * } catch (error) {
 *   if (error.isBlockedUserError) {
 *     setShowBlockedError(true);
 *   } else {
 *     setError(error.message);
 *   }
 * }
 * 
 * {showBlockedError && <BlockedUserError />}
 * ```
 */
function BlockedUserError({ errorMessage, onClose }) {
    const navigate = useNavigate();

    const defaultMessage = 'Çok fazla rezervasyon iptali yaptığınız için rezervasyon oluşturamıyorsunuz. Lütfen Locafy ekibiyle iletişime geçin.';

    return (
        <Alert
            severity="error"
            icon={<BlockIcon />}
            onClose={onClose}
            sx={{
                mb: 3,
                '& .MuiAlert-message': {
                    width: '100%',
                },
            }}
        >
            <AlertTitle sx={{ fontWeight: 'bold', mb: 1 }}>
                Rezervasyon Oluşturulamadı
            </AlertTitle>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
                {errorMessage || defaultMessage}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ContactMailIcon />}
                        onClick={() => navigate('/contact')}
                        sx={{ minWidth: 200 }}
                    >
                        İletişime Geç
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<HelpIcon />}
                        onClick={() => navigate('/about')}
                        sx={{ minWidth: 200 }}
                    >
                        Yardım
                    </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Sorununuzu çözmek için{' '}
                    <Link
                        href="/contact"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/contact');
                        }}
                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        iletişim sayfasından
                    </Link>
                    {' '}bize ulaşabilir veya{' '}
                    <Link
                        href="mailto:destek@locaffy.com"
                        sx={{ textDecoration: 'underline' }}
                    >
                        destek@locaffy.com
                    </Link>
                    {' '}adresine e-posta gönderebilirsiniz.
                </Typography>
            </Box>
        </Alert>
    );
}

export default BlockedUserError;

