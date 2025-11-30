import api from './api';

export const adminService = {
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

    getAllBusinesses: async () => {
        try {
            const response = await api.get('/admin/places');
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
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
    },

    updateBusiness: async (placeId, businessData) => {
        try {
            const response = await api.put(`/admin/places/${placeId}`, {
                name: businessData.name,
                email: businessData.email,
                phone: businessData.phone,
                address: businessData.address,
                status: businessData.status
            });
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Admin yetkisi gereklidir.');
            } else if (error.response?.status === 404) {
                throw new Error('İşletme bulunamadı.');
            } else if (error.response?.status === 400) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Geçersiz veri. Lütfen tüm alanları kontrol edin.';
                throw new Error(errorMessage);
            } else if (error.response?.status === 500) {
                throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                `İşletme güncellenirken bir hata oluştu (Status: ${error.response?.status})`;

            throw new Error(errorMessage);
        }
    },

    getBusinessSettings: async () => {
        try {
            const response = await api.get('/business/place/settings');
            const data = response.data;
            
            // openingHours formatı: "09:00-23:00" -> openingTime ve closingTime'a ayır
            let openingTime = '09:00';
            let closingTime = '23:00';
            if (data.openingHours) {
                const hours = data.openingHours.split('-');
                if (hours.length === 2) {
                    openingTime = hours[0].trim();
                    closingTime = hours[1].trim();
                }
            } else if (data.openingTime && data.closingTime) {
                openingTime = data.openingTime;
                closingTime = data.closingTime;
            }
            
            // workingDays formatı: "PAZARTESİ,SALI,..." -> array'e çevir
            let workingDays = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA'];
            if (data.workingDays) {
                if (Array.isArray(data.workingDays)) {
                    workingDays = data.workingDays;
                } else if (typeof data.workingDays === 'string') {
                    workingDays = data.workingDays.split(',').map(day => day.trim()).filter(day => day.length > 0);
                }
            }
            
            return { openingTime, closingTime, workingDays };
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            const backendMessage = error.response?.data?.message || 
                                 error.response?.data?.error ||
                                 error.response?.data?.detail ||
                                 'Bir hata oluştu';

            if (error.response?.status === 403) {
                throw new Error(`403 Forbidden: ${backendMessage}. Bu işlem için Business Owner yetkisi gereklidir.`);
            } else if (error.response?.status === 404) {
                throw new Error('Endpoint bulunamadı. Backend\'i kontrol edin.');
            } else if (error.response?.status === 500) {
                throw new Error(`Sunucu hatası: ${backendMessage}. Backend loglarını kontrol edin.`);
            }

            throw new Error(backendMessage);
        }
    },

    updateBusinessSettings: async (settings) => {
        try {
            const response = await api.put('/business/place/settings', {
                openingTime: settings.openingTime,
                closingTime: settings.closingTime,
                workingDays: settings.workingDays
            });
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            const backendMessage = error.response?.data?.message || 
                                 error.response?.data?.error ||
                                 error.response?.data?.detail ||
                                 'Bir hata oluştu';

            if (error.response?.status === 403) {
                throw new Error(`403 Forbidden: ${backendMessage}. Bu işlem için Business Owner yetkisi gereklidir.`);
            } else if (error.response?.status === 404) {
                throw new Error('Endpoint bulunamadı. Backend\'i kontrol edin.');
            } else if (error.response?.status === 500) {
                throw new Error(`Sunucu hatası: ${backendMessage}. Backend loglarını kontrol edin.`);
            }

            throw new Error(backendMessage);
        }
    }
};