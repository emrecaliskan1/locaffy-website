import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const ContactForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  maxWidth: '700px',
  margin: '0 auto',
}));

