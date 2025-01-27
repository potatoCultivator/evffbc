import React, { useState } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '[]');
    
    const calculateFee = (organization) => {
        return organization?.toLowerCase() === 'junior' ? 100 : 200;
    };

    const totalAmount = registrationData.reduce((sum, participant) => 
        sum + calculateFee(participant.organization), 0);

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

    const handleSaveAsPDF = async () => {
        const element = document.getElementById('invoice-content');
        if (!element) return;

        setIsGenerating(true);
        try {
            // Configure html2canvas for better mobile support
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                scrollY: -window.scrollY, // Handle scrolled content
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight,
                onclone: (doc) => {
                    // Ensure the cloned element is visible
                    doc.getElementById('invoice-content').style.display = 'block';
                }
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Handle mobile/desktop PDF sizing
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Add content to PDF with proper scaling
            let heightLeft = imgHeight;
            let position = 0;
            
            // First page
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Additional pages if content is long
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Create filename with timestamp
            const filename = `EVFFBC-Conference-Invoice-${new Date().toISOString().slice(0,10)}.pdf`;
            
            // Handle mobile devices
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                const blob = pdf.output('blob');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // Desktop download
                pdf.save(filename);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again or take a screenshot.');
        } finally {
            setIsGenerating(false);
        }
    };

    const mobileStyles = {
        container: {
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 }
        },
        card: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            mx: { xs: 1, sm: 'auto' }
        },
        cardContent: {
            p: { xs: 2, sm: 3, md: 4 }
        },
        header: {
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            mb: { xs: 1, sm: 2 },
            color: '#1e441f'
        },
        participantBox: {
            p: { xs: 1.5, sm: 2 },
            border: '1px solid rgba(30, 68, 31, 0.2)',
            borderRadius: 1,
            mb: 1
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 1, sm: 2 },
            '& > *': {
                wordBreak: 'break-word'
            }
        },
        totalSection: {
            mt: 4,
            p: { xs: 1.5, sm: 2 },
            borderTop: '2px solid rgba(30, 68, 31, 0.2)',
            backgroundColor: 'rgba(30, 68, 31, 0.05)',
            borderRadius: 1
        },
        buttons: {
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'stretch', sm: 'flex-end' }, // Align to right
            gap: { xs: 1, sm: 2 },
            mt: 3,
            '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' }
            }
        }
    };

    return (
        <Container maxWidth="md" sx={mobileStyles.container}>
            <Card sx={mobileStyles.card}>
                <CardContent sx={mobileStyles.cardContent} id="invoice-content">
                    <Box>
                        <Typography variant="h4" gutterBottom sx={mobileStyles.header}>
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
                                    <Box sx={mobileStyles.participantBox}>
                                        <Box sx={mobileStyles.infoGrid}>
                                            <Box>
                                                <Typography><strong>Name:</strong> {capitalizeWords(participant?.name)}</Typography>
                                                <Typography><strong>Email:</strong> {participant?.email?.toLowerCase()}</Typography>
                                                <Typography><strong>Church:</strong> {capitalizeWords(participant?.church)}</Typography>
                                                <Typography><strong>Sector:</strong> {participant.sector}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography><strong>Type:</strong> {capitalizeWords(participant?.organization)}</Typography>
                                                <Typography><strong>Gender:</strong> {capitalizeWords(participant?.gender)}</Typography>
                                                <Typography><strong>Reference:</strong> {formatReferenceCode(participant?.referenceCode)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={mobileStyles.totalSection}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={7}>
                                    <Typography variant="body2" color="textSecondary">
                                        Registration Fee: ₱200 per person (₱100 for Juniors)
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Number of Registrants: {registrationData.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            color: '#1e441f', 
                                            textAlign: { xs: 'left', sm: 'right' }, 
                                            fontWeight: 600 
                                        }}
                                    >
                                        Total Amount: ₱{totalAmount}.00
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#1e441f',
                                my: 3,
                                textAlign: 'center',
                                fontStyle: 'italic'
                            }}
                        >
                            Please take a screenshot or save this invoice for your records.
                        </Typography>

                        <Box sx={mobileStyles.buttons}>
                            <Button 
                                variant="outlined"
                                onClick={() => window.location.href = '/prereg'}
                                sx={{ 
                                    borderColor: '#1e441f', 
                                    color: '#1e441f',
                                    order: { xs: 2, sm: 1 }, // Reorder on mobile
                                    '&:hover': {
                                        borderColor: '#2e682f',
                                        background: 'rgba(46, 104, 47, 0.04)'
                                    }
                                }}
                            >
                                Register Another
                            </Button>
                            <Button 
                                variant="contained"
                                onClick={handleSaveAsPDF}
                                disabled={isGenerating}
                                sx={{
                                    background: 'linear-gradient(135deg, #1e441f 0%, #2e682f 100%)',
                                    color: '#fff',
                                    order: { xs: 1, sm: 2 }, // Reorder on mobile
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2e682f 0%, #1e441f 100%)',
                                    }
                                }}
                            >
                                {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Invoice;