import api from './api';

const menuService = {
    // Public endpoint to get menu by place ID
    getPlaceMenu: async (placeId) => {
        const response = await api.get(`/menu/place/${placeId}`);
        return response.data;
    },

    // Search menu items in a place
    searchMenuItems: async (placeId, searchTerm) => {
        const response = await api.get(`/menu/place/${placeId}/search`, {
            params: { searchTerm }
        });
        return response.data;
    },

    getMyItems: async () => {
        try {
            const response = await api.get('/menu/my-items');
            return response.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Menü öğeleri yüklenirken bir hata oluştu';

            throw new Error(errorMessage);
        }
    },

    getMyCategories: async () => {
        try {
            const response = await api.get('/menu/my-categories');
            return response.data; 
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Kategoriler yüklenirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },

    getItemsByCategory: async (category) => {
        try {
            const response = await api.get(`/menu/my-items/category/${encodeURIComponent(category)}`);
            return response.data; 
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Kategoriye göre menü öğeleri yüklenirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },

    createMenuItem: async (itemData) => {
        try {
            const response = await api.post('/menu/items', itemData);
            return response.data; // MenuItemResponse
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 400) {
                const validationError = 
                    error.response?.data?.message || 
                    'Geçersiz veri. Lütfen tüm zorunlu alanları doldurun.';
                throw new Error(validationError);
            }
            
            if (error.response?.status === 409) {
                throw new Error('Bu isimde bir ürün zaten mevcut. Lütfen farklı bir isim kullanın.');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Menü öğesi oluşturulurken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },

    updateMenuItem: async (menuItemId, itemData) => {
        try {
            const response = await api.put(`/menu/items/${menuItemId}`, itemData);
            return response.data; // MenuItemResponse
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 400) {
                const validationError = 
                    error.response?.data?.message || 
                    'Geçersiz veri. Lütfen tüm zorunlu alanları doldurun.';
                throw new Error(validationError);
            }
            
            if (error.response?.status === 404) {
                throw new Error('Menü öğesi bulunamadı veya yetkiniz yok.');
            }
            
            if (error.response?.status === 409) {
                throw new Error('Bu isimde bir ürün zaten mevcut. Lütfen farklı bir isim kullanın.');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Menü öğesi güncellenirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },
    
    deleteMenuItem: async (menuItemId) => {
        try {
            const response = await api.delete(`/menu/items/${menuItemId}`);
            return response.data; // { message: "Menü öğesi başarıyla silindi" }
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 404) {
                throw new Error('Menü öğesi bulunamadı veya yetkiniz yok.');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Menü öğesi silinirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },

    uploadMenuItemImage: async (menuItemId, file) => {
        try {
            // Dosya validasyonu
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('Dosya boyutu 5MB\'dan büyük olamaz.');
            }
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Sadece JPEG, PNG, GIF ve WebP formatları desteklenir.');
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post(`/menu/items/${menuItemId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data; // { message: "...", imageUrl: "https://..." }
        } catch (error) {
            if (!error.response) {
                // Client-side validation hatası veya network hatası
                throw error;
            }
            
            if (error.response?.status === 400) {
                const errorMessage = 
                    error.response?.data?.message || 
                    'Geçersiz dosya formatı veya boyutu.';
                throw new Error(errorMessage);
            }
            
            if (error.response?.status === 404) {
                throw new Error('Menü öğesi bulunamadı veya yetkiniz yok.');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Fotoğraf yüklenirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    },

    deleteMenuItemImage: async (menuItemId) => {
        try {
            const response = await api.delete(`/menu/items/${menuItemId}/image`);
            return response.data; // { message: "Menü öğesi fotoğrafı başarıyla silindi" }
        } catch (error) {
            if (!error.response) {
                throw new Error('İnternet bağlantınızı kontrol edin');
            }
            
            if (error.response?.status === 400) {
                throw new Error('Silinecek fotoğraf bulunamadı.');
            }
            
            if (error.response?.status === 404) {
                throw new Error('Menü öğesi bulunamadı veya yetkiniz yok.');
            }
            
            if (error.response?.status === 403) {
                throw new Error('Bu işlem için Business Owner yetkisi gereklidir.');
            }
            
            const errorMessage = 
                error.response?.data?.message || 
                'Fotoğraf silinirken bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    }
};

export default menuService;
