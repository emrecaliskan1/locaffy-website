import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';
import { ContactHeroSection, ContactForm, SubmitButton } from '../components/ui';
import { TextField } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Box component="main">
      <ContactHeroSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { md: '3rem' }
            }}
          >
            İletişim
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '48rem',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin.
          </Typography>
        </Container>
      </ContactHeroSection>

      <Box sx={{ py: 8, background: '#f9fafb' }}>
        <Container maxWidth="lg">
          <ContactForm>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 4,
                color: 'grey.800'
              }}
            >
              Bize Ulaşın
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={4} direction="column">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adınız"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="large"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-posta Adresiniz"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="large"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Konu"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="large"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mesajınız"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={10}
                    variant="outlined"
                    size="large"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <SubmitButton
                      type="submit"
                      variant="primary"
                      size="large"
                    >
                      Mesaj Gönder
                    </SubmitButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ContactForm>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;