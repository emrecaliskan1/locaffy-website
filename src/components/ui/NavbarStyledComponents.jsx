import {
  Box,
  Button
} from '@mui/material';
import { styled } from '@mui/system';

export const LogoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '18px',
  boxShadow: `0 4px 12px ${theme.palette.primary.main}35`,
}));

export const NavLink = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.grey[700],
  backgroundColor: active ? `${theme.palette.primary.main}10` : 'transparent',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}10`,
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: '-6px',
    transform: 'translateX(-50%)',
    width: active ? '18px' : '0px',
    height: '4px',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s',
  },
  '&:hover::after': {
    width: '18px',
  },
}));

export const GradientButton = styled(Button)(({ theme, variant }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  minWidth: '80px',
  transition: 'all 0.3s ease',
  ...(variant === 'secondary' ? {
    background: `linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)`,
    color: '#ea580c',
    border: '2px solid transparent',
    '&:hover': {
      background: `linear-gradient(135deg, #fdba74 0%, #fb923c 100%)`,
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
    },
  } : {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
      borderColor: theme.palette.primary.dark,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
    },
  }),
}));