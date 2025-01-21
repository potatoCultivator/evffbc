import React from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Grid,
    Button
} from '@mui/material';

const Invoice = () => {
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '[]');
    const REGISTRATION_FEE = 200;
    const totalAmount = registrationData.length * REGISTRATION_FEE;

    // Updated utility function with better error handling
    const capitalizeWords = (str) => {
        // Return empty string if input is null, undefined, or not a string
        if (!str || typeof str !== 'string') return '';
        
        try {
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } catch (error) {
            console.error('Error in capitalizeWords:', error);
            return str; // Return original string if transformation fails
        }
    };

    // Also update the reference code handling to be safer
    const formatReferenceCode = (code) => {
        if (!code || typeof code !== 'string') return '';
        return code.toUpperCase();
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
                <CardContent>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: '#1e441f' }}>
                            Registration Invoice
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Date: {new Date().toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#1e441f' }}>
                                    Registered Participants
                                </Typography>
                            </Grid>
                            {registrationData.map((participant, index) => (
                                <Grid item xs={12} key={index}>
                                    <Box sx={{
                                        p: 2,
                                        border: '1px solid rgba(30, 68, 31, 0.2)',
                                        borderRadius: 1,
                                        mb: 1
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography><strong>Name:</strong> {capitalizeWords(participant?.name)}</Typography>
                                                <Typography><strong>Email:</strong> {participant?.email?.toLowerCase()}</Typography>
                                                <Typography><strong>Church:</strong> {capitalizeWords(participant?.church)}</Typography>
                                                <Typography><strong>Sector:</strong> {participant.sector}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography><strong>Type:</strong> {capitalizeWords(participant?.organization)}</Typography>
                                                <Typography><strong>Gender:</strong> {capitalizeWords(participant?.gender)}</Typography>
                                                <Typography><strong>Reference:</strong> {formatReferenceCode(participant?.referenceCode)}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ 
                            mt: 4, 
                            p: 2, 
                            borderTop: '2px solid rgba(30, 68, 31, 0.2)',
                            backgroundColor: 'rgba(30, 68, 31, 0.05)',
                            borderRadius: 1
                        }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Registration Fee: ₱{REGISTRATION_FEE}.00 per person
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Number of Registrants: {registrationData.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h5" sx={{ color: '#1e441f', textAlign: 'right', fontWeight: 600 }}>
                                        Total Amount: ₱{totalAmount}.00
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#1e441f',
                                    mb: 3,
                                    textAlign: 'center',
                                    fontStyle: 'italic'
                                }}
                            >
                                Please take a screenshot or print this invoice for your records. 
                                You will need this for reference during the event.
                            </Typography>
                            <Box sx={{ textAlign: 'right' }}>
                                <Button 
                                    variant="contained"
                                    onClick={() => window.print()}
                                    sx={{
                                        background: 'linear-gradient(135deg, #1e441f 0%, #2e682f 100%)',
                                        color: '#fff',
                                        mr: 2,
                                        '&:hover': {
                                            borderColor: '#2e682f'
                                        }
                                    }}
                                >
                                    Print Invoice
                                </Button>
                                <Button 
                                    variant="outlined"
                                    onClick={() => window.location.href = '/online-registration'}
                                    sx={{ 
                                        borderColor: '#1e441f', 
                                        color: '#1e441f',
                                        '&:hover': {
                                            borderColor: '#2e682f'
                                        }
                                    }}
                                >
                                    Register Another
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Invoice;