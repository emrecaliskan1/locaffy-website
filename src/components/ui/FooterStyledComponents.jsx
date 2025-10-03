import {
  Box,
  Link
} from '@mui/material';
import { styled } from '@mui/system';

export const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1f2937',
  color: 'white',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
}));

export const FooterLink = styled(Link)(({ theme }) => ({
  color: '#d1d5db',
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

export const SocialIcon = styled(Link)(({ theme }) => ({
  fontSize: '1.5rem',
  textDecoration: 'none',
  display: 'inline-block',
  marginRight: theme.spacing(2),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));