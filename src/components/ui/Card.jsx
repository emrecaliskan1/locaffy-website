import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
import { Margin } from '@mui/icons-material';


export const StyledCard = styled(Card)(({ theme, variant = 'feature' }) => {
  const baseStyles = {
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const variants = {
    feature: {
      background: '#f9fafb',
      padding: theme.spacing(3),
      borderRadius: theme.spacing(2),
      boxShadow: 'none',
      minHeight: '260px',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
    },
    app: {
      background: 'white',
      padding: theme.spacing(2.5),
      borderRadius: theme.spacing(4),
      spacing: theme.spacing(10),
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      minHeight: '380px',
      maxWidth: '500px',
      '&:hover': {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
      },
    },
    about: {
      background: 'white',
      padding: theme.spacing(6),
      borderRadius: theme.spacing(2.5),
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      minHeight: '350px',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
    },
    team: {
      background: '#f9fafb',
      padding: theme.spacing(5),
      borderRadius: theme.spacing(2.5),
      boxShadow: 'none',
      minHeight: '300px',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        background: 'white',
      },
    }
  };

  return {
    ...baseStyles,
    ...variants[variant]
  };
});

export const FeatureCard = (props) => <StyledCard variant="feature" {...props} />;
export const AppFeatureCard = (props) => <StyledCard variant="app" {...props} />;
export const AboutCard = (props) => <StyledCard variant="about" {...props} />;
export const TeamCard = (props) => <StyledCard variant="team" {...props} />;