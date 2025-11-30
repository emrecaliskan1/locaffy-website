import api from './api';

// Token'dan role bilgisini alan helper fonksiyon
const getCurrentUserRole = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    return decoded.role || decoded.authorities?.[0] || decoded.authority || null;
  } catch (e) {
    return null;
  }
};

// Rol'e göre doğru endpoint'i döndüren helper fonksiyon
const getReviewsEndpoint = () => {
  const role = getCurrentUserRole();
  return role === 'ROLE_BUSINESS_OWNER' ? '/business/reviews' : '/admin/reviews';
};

const getDeleteEndpoint = (reviewId) => {
  const role = getCurrentUserRole();
  return role === 'ROLE_BUSINESS_OWNER' 
    ? `/business/reviews/${reviewId}` 
    : `/admin/reviews/${reviewId}`;
};

export const reviewService = {
  
  getAllReviews: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page !== undefined) {
        queryParams.append('page', params.page);
      }
      if (params.size !== undefined) {
        queryParams.append('size', params.size);
      }
      if (params.sort) {
        queryParams.append('sort', params.sort);
      }

      const baseEndpoint = getReviewsEndpoint();
      const url = `${baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error('İnternet bağlantınızı kontrol edin');
      }

      if (error.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      if (error.response?.status === 403) {
        const backendMessage = error.response?.data?.message || 
                             error.response?.data?.error ||
                             'Yetki hatası';
        const role = getCurrentUserRole();
        const endpoint = getReviewsEndpoint();
        
        throw new Error(
          `403 Forbidden: ${backendMessage}. ` +
          `Kullanılan endpoint: ${endpoint}. ` +
          (role === 'ROLE_BUSINESS_OWNER' 
            ? 'Sadece kendi işletmelerinizin yorumlarını görebilirsiniz.' 
            : 'Bu işlem için admin yetkisi gereklidir.')
        );
      }

      if (error.response?.status === 500) {
        throw new Error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
      }

      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || 'Yorumlar yüklenirken bir hata oluştu');
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const endpoint = getDeleteEndpoint(reviewId);
      await api.delete(endpoint);
    } catch (error) {
      if (!error.response) {
        throw new Error('İnternet bağlantınızı kontrol edin');
      }

      if (error.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      if (error.response?.status === 403) {
        const backendMessage = error.response?.data?.message || 
                             error.response?.data?.error ||
                             'Yetki hatası';
        const role = getCurrentUserRole();
        
        throw new Error(
          `403 Forbidden: ${backendMessage}. ` +
          (role === 'ROLE_BUSINESS_OWNER' 
            ? 'Sadece kendi işletmelerinizin yorumlarını silebilirsiniz.' 
            : 'Bu işlem için admin yetkisi gereklidir.')
        );
      }

      if (error.response?.status === 404) {
        throw new Error('Yorum bulunamadı.');
      }

      if (error.response?.status === 500) {
        throw new Error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
      }

      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || 'Yorum silinirken bir hata oluştu');
    }
  },
};