import api from './api';

export const imageService = {
    /**
     * İşletme logosu yükle
     * @param {number} placeId - İşletme ID'si
     * @param {File} file - Yüklenecek logo dosyası
     * @returns {Promise<{mainImageUrl: string, message: string}>}
     */
    uploadPlaceLogo: async (placeId, file) => {
        try {
            // Dosya validasyonu
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!allowedTypes.includes(file.type)) {
                throw new Error('Geçersiz dosya formatı. Sadece JPEG, PNG, GIF ve WebP formatları desteklenir.');
            }

            if (file.size > maxSize) {
                throw new Error('Logo dosyası çok büyük. Maksimum 2MB olmalıdır.');
            }

            const formData = new FormData();
            formData.append('file', file);

            // Endpoint otomatik olarak main_image_url alanına kaydeder (banner ve logo aynı alanı kullanıyor)
            const response = await api.post(`/images/place/${placeId}/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            if (error.response?.status === 400) {
                const message = error.response?.data?.message || 
                               'Geçersiz dosya formatı veya boyut. Maksimum 2MB olmalıdır.';
                throw new Error(message);
            }

            if (error.response?.status === 403) {
                // Token kontrolü
                const token = localStorage.getItem('accessToken');
                let tokenInfo = '';
                
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        const decoded = JSON.parse(jsonPayload);
                        const role = decoded.role || decoded.authorities?.[0] || decoded.authority;
                        tokenInfo = ` (Mevcut rol: ${role || 'bulunamadı'})`;
                    } catch (e) {
                        // Token decode hatası - sessizce geç
                    }
                }
                
                const backendMessage = error.response?.data?.message || 
                                     error.response?.data?.error;
                const message = backendMessage || 
                               `Bu işletmeye logo yükleme yetkiniz yok.${tokenInfo} Lütfen işletme sahibi olarak giriş yaptığınızdan emin olun.`;
                throw new Error(message);
            }

            if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Logo yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    /**
     * İşletme logosu sil
     * @param {number} placeId - İşletme ID'si
     * @returns {Promise<{message: string}>}
     */
    deletePlaceLogo: async (placeId) => {
        try {
            // Endpoint otomatik olarak main_image_url'i siler (banner ve logo aynı alanı kullanıyor)
            const response = await api.delete(`/images/place/${placeId}/logo`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            if (error.response?.status === 400) {
                const message = error.response?.data?.message || 
                               'Logo bulunamadı';
                throw new Error(message);
            }

            if (error.response?.status === 403) {
                const backendMessage = error.response?.data?.message || 
                                     error.response?.data?.error;
                const message = backendMessage || 
                               'Bu işletmenin logosunu silme yetkiniz yok. Lütfen işletme sahibi olarak giriş yaptığınızdan emin olun.';
                throw new Error(message);
            }

            if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Logo silinirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },
};

