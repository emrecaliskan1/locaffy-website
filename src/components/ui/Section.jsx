import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const HeroSection = styled(Box)(({ theme, variant = 'default' }) => {
  const baseStyles = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    textAlign: 'center',
    marginTop: '-15px'
  };

  const variants = {
    default: {
      padding: theme.spacing(12, 0),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(8, 0),
      }
    },
    compact: {
      padding: theme.spacing(10, 0),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
      }
    },
    fullHeight: {
      padding: theme.spacing(15, 0),
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(8, 0),
        minHeight: 'auto',
      }
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const AboutHeroSection = styled(HeroSection)({});
export const ContactHeroSection = styled(HeroSection)({});
export const JoinUsHeroSection = styled(HeroSection)({});