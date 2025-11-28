import React, { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

/**
 * PlaceLogo - İşletme logosu gösterim komponenti
 * @param {string|null} logoUrl - Logo URL'i
 * @param {number} size - Logo boyutu (default: 80)
 * @param {object} sx - Ek stil özellikleri
 */
const PlaceLogo = ({ logoUrl, size = 80, sx = {} }) => {
    const [imageError, setImageError] = useState(false);

    const defaultLogo = (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor: 'primary.main',
                ...sx
            }}
        >
            <BusinessIcon sx={{ fontSize: size * 0.6 }} />
        </Avatar>
    );

    if (!logoUrl || imageError) {
        return defaultLogo;
    }

    return (
        <Box
            component="img"
            src={logoUrl}
            alt="İşletme Logosu"
            onError={() => {
                setImageError(true);
            }}
            sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: 3,
                ...sx
            }}
        />
    );
};

export default PlaceLogo;

