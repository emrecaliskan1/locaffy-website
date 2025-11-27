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
    }
};

export default menuService;
