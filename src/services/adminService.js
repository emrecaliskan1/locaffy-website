import api from './api';

export const adminService = {
    // NOT: Bu endpoint backend'de henüz oluşturulmadı
    // Backend geliştiricisi /api/admin/dashboard/stats endpoint'ini oluşturmalı
    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            // 403 veya 404 = endpoint henüz backend'de yok
            // Spring Security endpoint bulamadığında 403 dönebiliyor
            if (error.response?.status === 403 || error.response?.status === 404) {
                // Endpoint henüz backend'de oluşturulmadı
                throw new Error('DASHBOARD_STATS_NOT_IMPLEMENTED');
            } else if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                `İstatistikler yüklenirken bir hata oluştu (Status: ${error.response?.status})`;

            throw new Error(errorMessage);
        }
    },

    // Backend'de /api/admin/places endpoint'i kullanılıyor
    // NOT: Backend şu an pagination desteklemiyor, direkt List<PlaceResponse> döndürüyor
    getAllBusinesses: async () => {
        try {
            // Backend'deki mevcut endpoint: GET /api/admin/places
            // Response: List<PlaceResponse> (pagination yok)
            const response = await api.get('/admin/places');
            // Backend direkt array döndürüyor
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
                // 403 hatası - Token gönderiliyor ama yetki yok
                // Token'ı kontrol et ve debug bilgisi ver
                const token = localStorage.getItem('accessToken');
                let tokenDebugInfo = '';
                
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        const decoded = JSON.parse(jsonPayload);
                        const role = decoded.role || decoded.authorities?.[0] || decoded.authority;
                        
                        console.error('403 Forbidden - Token Debug Info:', {
                            role: role,
                            decodedToken: decoded,
                            endpoint: '/admin/places',
                            hasToken: !!token
                        });
                        
                        tokenDebugInfo = `Token'da role: ${role || 'bulunamadı'}. `;
                    } catch (e) {
                        console.error('Token decode hatası:', e);
                        tokenDebugInfo = 'Token decode edilemedi. ';
                    }
                } else {
                    tokenDebugInfo = 'Token bulunamadı. ';
                }
                
                const backendMessage = error.response?.data?.message || 
                                     error.response?.data?.error ||
                                     'Yetki hatası';
                
                throw new Error(
                    `403 Forbidden: ${backendMessage}. ` +
                    `${tokenDebugInfo}` +
                    `Backend'de endpoint'in @PreAuthorize("hasRole('ADMIN')") ile korunduğundan ve ` +
                    `token'da ROLE_ADMIN olduğundan emin olun.`
                );
            } else if (error.response?.status === 404) {
                throw new Error('İşletme listesi endpoint\'i bulunamadı. Backend\'i kontrol edin.');
            } else if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                `İşletmeler yüklenirken bir hata oluştu (Status: ${error.response?.status})`;

            throw new Error(errorMessage);
        }
    },

    // İşletme silme - Backend'de DELETE /api/admin/places/{id}
    deleteBusiness: async (placeId) => {
        try {
            const response = await api.delete(`/admin/places/${placeId}`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Admin yetkisi gereklidir.');
            } else if (error.response?.status === 404) {
                throw new Error('İşletme bulunamadı.');
            } else if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                `İşletme silinirken bir hata oluştu (Status: ${error.response?.status})`;

            throw new Error(errorMessage);
        }
    },

    // İşletme durumu değiştirme - Backend'de PUT /api/admin/places/{id}/toggle-status
    toggleBusinessStatus: async (placeId) => {
        try {
            const response = await api.put(`/admin/places/${placeId}/toggle-status`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Admin yetkisi gereklidir.');
            } else if (error.response?.status === 404) {
                throw new Error('İşletme bulunamadı.');
            } else if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                `İşletme durumu değiştirilirken bir hata oluştu (Status: ${error.response?.status})`;

            throw new Error(errorMessage);
        }
    }
};