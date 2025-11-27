import api from './api';

export const ReservationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
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
    }

}