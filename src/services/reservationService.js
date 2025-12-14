import api from './api';

export const ReservationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    COMPLETED: 'COMPLETED',
    NO_SHOW: 'NO_SHOW',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
};

export const reservationService = {
    // Kullanıcının tüm place'lerini getir
    getMyPlaces: async () => {
        try {
            const response = await api.get('/business/places');
            return response.data; // List<PlaceResponse>
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            if (error.response?.status === 403) {
                // 403 hatası - Token gönderiliyor ama yetki yok
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
                        
                        console.error('403 Forbidden - Token Debug Info (getMyPlaces):', {
                            role: role,
                            decodedToken: decoded,
                            endpoint: '/business/places',
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
                    `Backend'de endpoint'in @PreAuthorize("hasRole('BUSINESS_OWNER')") ile korunduğundan ve ` +
                    `token'da ROLE_BUSINESS_OWNER olduğundan emin olun.`
                );
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'İşletme bilgileri yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    getPlaceReservations: async (placeId) => {
        try {
            const response = await api.get(`/reservations/place/${placeId}`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Rezervasyonlar yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    updateReservationStatus: async (reservationId, statusUpdate) => {
        try {
            const response = await api.put(`/reservations/${reservationId}/status`, statusUpdate);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Rezervasyon durumu güncellenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    approveReservation: async (reservationId) => {
        return reservationService.updateReservationStatus(reservationId, { status: ReservationStatus.APPROVED });
    },

    rejectReservation: async (reservationId, rejectionReason) => {
        return reservationService.updateReservationStatus(reservationId, {
            status: ReservationStatus.REJECTED,
            rejectionReason: rejectionReason,
        })
    },

    cancelReservation: async (reservationId) => {
        return reservationService.updateReservationStatus(reservationId, {
            status: ReservationStatus.CANCELLED
        });
    },

    completeReservation: async (reservationId) => {
        try {
            const response = await api.post(`/reservations/${reservationId}/complete`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Rezervasyon tamamlanırken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    createReservation: async (reservationData) => {
        try {
            const response = await api.post('/reservations', reservationData);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Rezervasyon oluşturulurken bir hata oluştu';

            // Engellenen kullanıcı hatası kontrolü
            if (error.response?.status === 400 && 
                (errorMessage.includes('Locafy ekibiyle iletişime geçin') || 
                 errorMessage.includes('rezervasyon oluşturamıyorsunuz') ||
                 errorMessage.includes('iptal oranınız'))) {
                const blockedError = new Error(errorMessage);
                blockedError.isBlockedUserError = true;
                throw blockedError;
            }

            throw new Error(errorMessage);
        }
    }
}