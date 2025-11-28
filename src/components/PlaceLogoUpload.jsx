import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    Paper,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import { imageService } from '../services/imageService';
import { reservationService } from '../services/reservationService';
import { authService } from '../services/authService';
import PlaceLogo from './PlaceLogo';

/**
 * PlaceLogoUpload - Logo yükleme komponenti
 * @param {number} placeId - İşletme ID'si
 * @param {string|null} currentMainImageUrl - Mevcut logo URL'i (mainImageUrl kullanılıyor)
 * @param {function} onLogoUpdate - Logo güncellendiğinde çağrılacak callback
 */
const PlaceLogoUpload = ({ placeId, currentMainImageUrl, onLogoUpdate }) => {
    const [userPlaces, setUserPlaces] = useState([]);
    const [checkingOwnership, setCheckingOwnership] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Kullanıcının sahip olduğu place'leri al ve mainLogoUrl'i güncelle
    useEffect(() => {
        const loadUserPlaces = async () => {
            if (!placeId) return;
            
            setCheckingOwnership(true);
            try {
                const places = await reservationService.getMyPlaces();
                if (places && Array.isArray(places)) {
                    setUserPlaces(places);
                    
                    // Mevcut place'in mainImageUrl'ini güncelle
                    const currentPlace = places.find(p => p.id === placeId);
                    if (currentPlace && onLogoUpdate) {
                        // Backend'den mainImageUrl dönüyor (banner ve logo aynı alanı kullanıyor)
                        const mainImageUrl = currentPlace.mainImageUrl || null;
                        // Sadece farklıysa güncelle (sonsuz döngüyü önlemek için)
                        if (mainImageUrl !== currentMainImageUrl) {
                            onLogoUpdate(mainImageUrl);
                        }
                    }
                }
            } catch (err) {
                // Hata durumunda backend kontrolü yapacak
            } finally {
                setCheckingOwnership(false);
            }
        };

        loadUserPlaces();
    }, [placeId]);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setSuccess('');

        // Dosya formatı kontrolü
        if (!allowedTypes.includes(file.type)) {
            setError('Geçersiz dosya formatı. Sadece JPEG, PNG, GIF ve WebP formatları desteklenir.');
            return;
        }

        // Dosya boyutu kontrolü
        if (file.size > maxSize) {
            setError('Logo dosyası çok büyük. Maksimum 2MB olmalıdır.');
            return;
        }

        setSelectedFile(file);

        // Önizleme oluştur
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const response = await imageService.uploadPlaceLogo(placeId, selectedFile);
            
            console.log('✅ Logo yükleme response:', response);
            console.log('✅ Response keys:', Object.keys(response || {}));
            
            setSuccess('Logo başarıyla yüklendi!');
            setSelectedFile(null);
            
            // Backend'den dönen mainImageUrl'i al (banner ve logo aynı alanı kullanıyor)
            const newMainImageUrl = response?.mainImageUrl || null;
            console.log('✅ Yeni mainImageUrl:', newMainImageUrl);
            console.log('✅ Mevcut currentMainImageUrl:', currentMainImageUrl);
            
            // Önce response'tan gelen URL'i kullan
            if (onLogoUpdate) {
                if (newMainImageUrl) {
                    onLogoUpdate(newMainImageUrl);
                    setPreviewUrl(null); // Preview'ı temizle, yeni logo gösterilsin
                } else {
                    // Eğer response'ta URL yoksa, place listesini yeniden yükle
                    console.log('⚠️ Response\'ta mainImageUrl yok, place listesi yeniden yükleniyor...');
                    setTimeout(async () => {
                        try {
                            const places = await reservationService.getMyPlaces();
                            console.log('📋 Yeniden yüklenen places:', places);
                            if (places && Array.isArray(places)) {
                                const currentPlace = places.find(p => p.id === placeId);
                                console.log('🎯 Bulunan place:', currentPlace);
                                if (currentPlace) {
                                    // Backend'den mainImageUrl dönüyor (banner ve logo aynı alanı kullanıyor)
                                    const updatedMainImageUrl = currentPlace.mainImageUrl || null;
                                    console.log('✅ Güncellenen mainImageUrl:', updatedMainImageUrl);
                                    console.log('✅ Place objesi keys:', Object.keys(currentPlace || {}));
                                    if (onLogoUpdate) {
                                        onLogoUpdate(updatedMainImageUrl);
                                    }
                                }
                            }
                        } catch (err) {
                            console.error('❌ Place listesi yüklenirken hata:', err);
                        }
                    }, 1000); // 1 saniye bekle, backend'in güncellemesi için
                    setPreviewUrl(null);
                }
            }

            // Başarı mesajını 3 saniye sonra kaldır
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            // 403 hatası için özel mesaj
            if (err.response?.status === 403) {
                const backendMessage = err.response?.data?.error || err.response?.data?.message;
                if (backendMessage) {
                    setError(backendMessage);
                } else {
                    setError('Bu işletmeye logo yükleme yetkiniz yok.');
                }
            } else {
                setError(err.message || 'Logo yüklenirken bir hata oluştu');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentMainImageUrl) return;

        if (!window.confirm('Logoyu silmek istediğinizden emin misiniz?')) {
            return;
        }

        setDeleting(true);
        setError('');
        setSuccess('');

        try {
            await imageService.deletePlaceLogo(placeId);
            
            setSuccess('Logo başarıyla silindi!');
            
            // Callback ile parent component'i bilgilendir
            if (onLogoUpdate) {
                onLogoUpdate(null);
            }

            // Başarı mesajını 3 saniye sonra kaldır
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Logo silinirken bir hata oluştu');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Ownership kontrolü - Backend kontrolü yapacak, frontend sadece bilgi amaçlı
    // getMyPlaces() zaten sadece kullanıcının place'lerini döndürüyor
    const hasAccess = userPlaces.length === 0 || userPlaces.some(p => p.id === placeId);

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                İşletme Logosu
            </Typography>

            {checkingOwnership && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Yetki kontrolü yapılıyor...
                </Alert>
            )}

            {!checkingOwnership && !hasAccess && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Bu işletmeye (ID: {placeId}) erişim yetkiniz yok. Sadece sahip olduğunuz işletmelere logo yükleyebilirsiniz.
                    {userPlaces.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Sahip olduğunuz işletmeler: {userPlaces.map(p => p.name || `ID: ${p.id}`).join(', ')}
                        </Typography>
                    )}
                </Alert>
            )}

            {/* Mevcut Logo Gösterimi */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <PlaceLogo 
                    logoUrl={previewUrl || currentMainImageUrl} 
                    size={100}
                />
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {currentMainImageUrl ? 'Mevcut Logo' : 'Logo yüklenmemiş'}
                    </Typography>
                    {currentMainImageUrl && (
                        <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={deleting}
                            sx={{ mt: 1 }}
                        >
                            {deleting ? 'Siliniyor...' : 'Logoyu Sil'}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Hata ve Başarı Mesajları */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {/* Dosya Seçimi */}
            <Box sx={{ mb: 2 }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="logo-upload-input"
                />
                <label htmlFor="logo-upload-input">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading || deleting || !hasAccess || checkingOwnership}
                        fullWidth
                    >
                        Logo Dosyası Seç
                    </Button>
                </label>
            </Box>

            {/* Dosya Bilgisi ve Önizleme */}
            {selectedFile && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <ImageIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                                {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </Typography>
                        </Box>
                    </Box>

                    {/* Önizleme */}
                    {previewUrl && (
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <PlaceLogo logoUrl={previewUrl} size={120} />
                        </Box>
                    )}

                    {/* Butonlar */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={uploading || !hasAccess}
                            fullWidth
                        >
                            {uploading ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Yükleniyor...
                                </>
                            ) : (
                                'Logoyu Yükle'
                            )}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={uploading}
                        >
                            İptal
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Bilgilendirme */}
            <Typography variant="caption" color="text.secondary" display="block">
                • Desteklenen formatlar: JPEG, PNG, GIF, WebP
                <br />
                • Maksimum dosya boyutu: 2MB
            </Typography>
        </Box>
    );
};

export default PlaceLogoUpload;

