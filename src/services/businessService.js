import api, { publicApi } from './api';

export const businessService = {
    submitApplication: async (applicationData) => {
        try {
            const response = await publicApi.post('/business-applications', applicationData);

            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data?.errors?.message ||
                error.response?.data?.errors?.[0]?.message ||
                error.message ||
                'Başvuru gönderilirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    approveApplication: async (id) => {
        try {
            const response = await api.put(`/business-applications/${id}/approve`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            // 409 Conflict - Başvuru zaten onaylanmış veya reddedilmiş
            if (error.response?.status === 409) {
                const message = error.response?.data?.message || 
                               'Bu başvuru zaten işleme alınmış. Sadece bekleyen başvurular onaylanabilir.';
                throw new Error(message);
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Başvuru onaylanırken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    getAllApplications: async (status, page = 0, size = 10) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sort: 'createdAt,DESC',
            });

            if (status) {
                params.append('status', status);
            }

            const response = await api.get(`/business-applications?${params.toString()}`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data?.errors?.message ||
                error.response?.data?.errors?.[0]?.message ||
                error.message ||
                'Başvurular yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    getApplicationById: async (id) => {
        try {
            const response = await api.get(`/business-applications/${id}`);
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Başvuru bilgileri yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    rejectApplication: async (id, rejectionReason) => {
        try {
            const response = await api.put(`/business-applications/${id}/reject`, {
                rejectionReason
            });
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            // 409 Conflict - Başvuru zaten onaylanmış veya reddedilmiş
            if (error.response?.status === 409) {
                const message = error.response?.data?.message || 
                               'Bu başvuru zaten işleme alınmış. Sadece bekleyen başvurular reddedilebilir.';
                throw new Error(message);
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Başvuru reddedilirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    getApplicationStats: async () => {
        try {
            const response = await api.get('/business-applications/stats');
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'İstatistikler yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    }
}