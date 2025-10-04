import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const StyledButton = styled(Button)(({ theme, variant = 'primary' }) => {
  const baseStyles = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
  };

  const variants = {
    primary: {
      padding: theme.spacing(1.5, 4),
      fontSize: '1rem',
      background: `linear-gradient(135deg, #ff8a50 0%, #ff6b35 50%, ${theme.palette.primary.main} 100%)`,
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 138, 80, 0.3)',
      '&:hover': {
        background: `linear-gradient(135deg, #ff7043 0%, #ff5722 50%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 6px 20px rgba(255, 112, 67, 0.4)',
        transform: 'translateY(-2px)',
      },
    },
    hero: {
      padding: theme.spacing(2, 4),
      fontSize: '1.125rem',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid white',
      color: 'white',
      '&:hover': {
        background: 'white',
        color: theme.palette.primary.main,
      },
    },
    outline: {
      padding: theme.spacing(1.5, 4),
      fontSize: '1rem',
      background: 'transparent',
      border: `2px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
      '&:hover': {
        background: theme.palette.primary.main,
        color: 'white',
      },
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const PrimaryButton = styled(StyledButton)({});
export const HeroButton = styled(StyledButton)({});
export const SubmitButton = styled(StyledButton)({});
export const JoinUsButton = styled(StyledButton)({});