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
    getAllBusinesses: async (page = 0, size = 10, sort = null, status = null) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });

            if (sort) {
                params.append('sort', sort);
            }

            if (status) {
                params.append('status', status);
            }

            // Backend'deki mevcut endpoint: /api/admin/places
            const response = await api.get(`/admin/places?${params.toString()}`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Admin yetkisi gereklidir.');
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