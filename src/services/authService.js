import api, { publicApi } from './api';

const saveTokens = (accessToken, refreshToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
};

const saveUser = (user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

// JWT token'dan role bilgisini decode et
const decodeToken = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Token decode hatası:', error);
        return null;
    }
}

export const authService = {
    register: async (userData) => {
        try {
            const response = await publicApi.post('/auth/register', userData);
            const { accessToken, refreshToken, userId, username, email, role, hasSeenOnboarding } = response.data;

            saveTokens(accessToken, refreshToken);
            const user = {
                userId,
                username,
                email,
                role,
                hasSeenOnboarding
            };
            if (user.userId) {
                saveUser(user);
            }
            return {
                accessToken,
                refreshToken,
                user: {
                    userId,
                    username,
                    email,
                    role,
                    hasSeenOnboarding
                }
            };

        } catch (error) {
            if(!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }
            const errorMessage =
                error.response.data?.message ||
                error.response.data?.error ||
                error.response?.data?.errors?.message ||
                error.response?.data?.errors?.[0]?.message ||
                error.message ||
                'Kayıt işlemi başarısız oldu';
            
                throw new Error(errorMessage);
        }
    },

    login: async (credentials) => {
        try  {
            const response = await publicApi.post('/auth/login', credentials);

            // Backend'den token veya accessToken gelebilir
            const token = response.data.token || response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const { userId, username, email, hasSeenOnboarding } = response.data;

            // Token'dan role bilgisini decode et
            let role = response.data.role;
            if (!role && token) {
                const decodedToken = decodeToken(token);
                role = decodedToken?.role || decodedToken?.authorities?.[0] || null;
            }

            // Token'ı accessToken olarak kaydet
            if (token) {
                localStorage.setItem('accessToken', token);
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            
            const user = {
                userId,
                username,
                email,
                role,
                hasSeenOnboarding
            };

            if (user.userId) {
                saveUser(user);
            }

            return {
                token: token,
                refreshToken,
                user: {
                    userId,
                    username,
                    email,
                    role,
                    hasSeenOnboarding
                }
            };
        } catch (error) {
            if(!error.response) {
                throw new Error('İnternet bağlantısını kontrol edin');
            }

            const errorMessage = 
            error.response?.data?.message ||           
            error.response?.data?.error ||         
            error.response?.data?.errors?.message ||   
            error.response?.data?.errors?.[0]?.message || 
            error.message ||                           
            'Giriş işlemi başarısız oldu';            
        
        throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.userId;
    
            if (userId) {
                // ✅ DÜZELTME: Query parameter kullan
                await api.post(`/auth/logout?userId=${userId}`);
            }
    
            clearTokens();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            clearTokens();
            window.location.href = '/login';
        }
    },
    
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken) {
                throw new Error('Refresh token bulunamadı');
            }
    
            const response = await publicApi.post('/auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            saveTokens(accessToken, newRefreshToken);
            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            clearTokens();
            window.location.href = '/login';
            throw error;
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
}