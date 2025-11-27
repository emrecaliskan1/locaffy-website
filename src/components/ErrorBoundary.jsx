import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
                    <Box sx={{ p: 4, bgcolor: '#fff0f0', borderRadius: 2, border: '1px solid #ffcdd2' }}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Bir şeyler yanlış gitti.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Uygulama beklenmedik bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya geliştirici ile iletişime geçin.
                        </Typography>

                        <Box sx={{ mt: 4, textAlign: 'left', bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
                            <Typography variant="subtitle2" color="error" sx={{ fontFamily: 'monospace', mb: 1 }}>
                                {this.state.error && this.state.error.toString()}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => window.location.reload()}
                            sx={{ mt: 4 }}
                        >
                            Sayfayı Yenile
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
