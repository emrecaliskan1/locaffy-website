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
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      color: 'white',
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.error.main} 100%)`,
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