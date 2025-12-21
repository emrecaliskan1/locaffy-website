import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const HeroSection = styled(Box)(({ theme, variant = 'default' }) => {
  const baseStyles = {
    background: `
      linear-gradient(rgba(139, 92, 246, 0.85), rgba(124, 58, 237, 0.85)),
      url('/hero-map-bg.png')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: 'white',
    textAlign: 'center',
    marginTop: '-15px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(3px)',
      WebkitBackdropFilter: 'blur(3px)',
      zIndex: 0
    },
    '& > *': {
      position: 'relative',
      zIndex: 1
    }
  };

  const variants = {
    default: {
      padding: theme.spacing(6, 0),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(4, 0),
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