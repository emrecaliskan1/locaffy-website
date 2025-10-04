import {
  Box,
  Link
} from '@mui/material';
import { styled } from '@mui/system';

export const StyledFooterContainer = styled(Box)(({ theme, variant = 'default' }) => {
  const baseStyles = {
    color: 'white',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  };

  const variants = {
    default: {
      backgroundColor: '#1f2937',
    },
    dark: {
      backgroundColor: '#111827',
    },
    gradient: {
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    },
    colored: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const StyledFooterLink = styled(Link)(({ theme, variant = 'default' }) => {
  const baseStyles = {
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const variants = {
    default: {
      color: '#d1d5db',
      '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
      },
    },
    primary: {
      color: '#f3f4f6',
      fontWeight: 500,
      '&:hover': {
        color: '#ff8a50',
        textDecoration: 'none',
        transform: 'translateX(4px)',
      },
    },
    secondary: {
      color: '#9ca3af',
      '&:hover': {
        color: '#e5e7eb',
        textDecoration: 'underline',
      },
    },
    social: {
      color: '#d1d5db',
      fontSize: '1rem',
      fontWeight: 600,
      '&:hover': {
        color: '#ff6b35',
        textDecoration: 'none',
      },
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const StyledSocialIcon = styled(Link)(({ theme, variant = 'default' }) => {
  const baseStyles = {
    fontSize: '1.5rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginRight: theme.spacing(2),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const variants = {
    default: {
      color: '#d1d5db',
      '&:hover': {
        transform: 'translateY(-2px)',
        color: theme.palette.primary.main,
      },
    },
    rounded: {
      color: '#9ca3af',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&:hover': {
        transform: 'translateY(-4px) scale(1.1)',
        backgroundColor: 'rgba(255, 138, 80, 0.2)',
        color: '#ff8a50',
        boxShadow: '0 4px 12px rgba(255, 138, 80, 0.3)',
      },
    },
    gradient: {
      color: 'white',
      background: 'linear-gradient(135deg, #ff8a50 0%, #ff6b35 100%)',
      '&:hover': {
        transform: 'translateY(-4px) scale(1.1)',
        background: 'linear-gradient(135deg, #ff7043 0%, #ff5722 100%)',
        boxShadow: '0 6px 16px rgba(255, 138, 80, 0.4)',
      },
    },
    minimal: {
      color: '#6b7280',
      backgroundColor: 'transparent',
      '&:hover': {
        color: '#e5e7eb',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transform: 'scale(1.1)',
      },
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const FooterContainer = (props) => <StyledFooterContainer variant="default" {...props} />;
export const DarkFooterContainer = (props) => <StyledFooterContainer variant="dark" {...props} />;
export const GradientFooterContainer = (props) => <StyledFooterContainer variant="gradient" {...props} />;
export const ColoredFooterContainer = (props) => <StyledFooterContainer variant="colored" {...props} />;

export const FooterLink = (props) => <StyledFooterLink variant="default" {...props} />;
export const PrimaryFooterLink = (props) => <StyledFooterLink variant="primary" {...props} />;
export const SecondaryFooterLink = (props) => <StyledFooterLink variant="secondary" {...props} />;
export const SocialFooterLink = (props) => <StyledFooterLink variant="social" {...props} />;

export const SocialIcon = (props) => <StyledSocialIcon variant="default" {...props} />;
export const RoundedSocialIcon = (props) => <StyledSocialIcon variant="rounded" {...props} />;
export const GradientSocialIcon = (props) => <StyledSocialIcon variant="gradient" {...props} />;
export const MinimalSocialIcon = (props) => <StyledSocialIcon variant="minimal" {...props} />;