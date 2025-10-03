import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledIcon = styled(Box)(({ theme, variant = 'feature', size = 'medium' }) => {
  const baseStyles = {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fef3e2',
    color: theme.palette.primary.main,
  };

  const sizes = {
    small: { width: 50, height: 50, fontSize: '1.5rem', margin: '0 auto 1rem' },
    medium: { width: 70, height: 70, fontSize: '2.2rem', margin: '0 auto 1.5rem' },
    large: { width: 100, height: 100, fontSize: '3rem', margin: '0 auto 2rem' },
  };

  return {
    ...baseStyles,
    ...sizes[size]
  };
});

export const AppFeatureImage = styled(Box)(({ gradient }) => ({
  width: '100%',
  height: 150,
  borderRadius: 12,
  marginBottom: 16,
  background: gradient || 'linear-gradient(45deg, #f97316, #dc2626)',
}));

export const FeatureIcon = styled(StyledIcon)({});
export const AboutCardIcon = styled(StyledIcon)({});