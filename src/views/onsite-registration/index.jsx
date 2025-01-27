import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Typography,
    FormHelperText,
    Container,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { uploadBatchConfereesOnsite } from '../Query';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const OnsiteRegistration = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        church: '',
        sector: '',
        gender: '',
        organization: '', // Changed from type to organization
        email: ''  // Add email to initial state
    });
    const [errors, setErrors] = useState({});
    const [batch, setBatch] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) {
                newErrors[key] = 'This field is required';
            }
        });
        // Add email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAnother = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newRegistrant = {
                name: formData.name,
                church: formData.church,
                sector: formData.sector,
                gender: formData.gender,
                organization: formData.organization, // Changed from type to organization
                email: formData.email,
                status: 'pending',
                regType: 'onsite'
            };
            
            setBatch(prev => [...prev, newRegistrant]);
            
            // Reset form but keep church, sector, and email
            setFormData({
                name: '',
                church: formData.church,
                sector: formData.sector,
                email: formData.email,
                gender: '',
                organization: '' // Changed from type to organization
            });
            setErrors({}); // Clear any existing errors
        }
    };

    const handleSubmitAll = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions

        try {
            setIsSubmitting(true); // Disable submit button

            if (batch.length === 0) {
                alert('Please add at least one registration before submitting');
                return;
            }

            // Create properly structured data for each registrant
            const batchData = batch.map(person => ({
                name: person.name.toLowerCase(),
                church: person.church.toLowerCase(),
                sector: person.sector,
                gender: person.gender.toLowerCase(),
                organization: person.organization.toLowerCase(),
                email: person.email.toLowerCase()
            }));

            console.log('Submitting batch:', batchData); // Debug log
            
            await uploadBatchConfereesOnsite(batchData);
            localStorage.setItem('registrationData', JSON.stringify(batchData));
            setSuccessDialogOpen(true);
            setBatch([]);
            setFormData({
                name: '',
                church: '',
                sector: '',
                gender: '',
                email: '',
                organization: '' // Changed from type to organization
            });
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Failed to submit registration. Please try again.');
        } finally {
            setIsSubmitting(false); // Re-enable submit button
        }
    };

    const handleRemoveFromBatch = (index) => {
        setBatch(prev => prev.filter((_, i) => i !== index));
    };

    const customInputStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '&.Mui-focused fieldset': {
                borderColor: '#1e441f',
                borderWidth: '2px'
            },
            '&:hover fieldset': {
                borderColor: '#1e441f'
            },
            '& input': {
                color: '#1e441f',
            },
            '& fieldset': {
                borderColor: 'rgba(30, 68, 31, 0.5)'
            }
        },
        '& .MuiInputLabel-root': {
            color: '#1e441f',
            '&.Mui-focused': {
                color: '#1e441f'
            }
        },
        '& .MuiSelect-icon': {
            color: '#1e441f'
        },
        '& .MuiSelect-select': {
            color: '#1e441f'
        },
        '& .MuiFormHelperText-root': {
            color: '#ff3d00',
            marginLeft: 0,
            fontSize: '0.75rem'
        }
    };

    // Disabled message component
    const DisabledMessage = () => (
        <Card sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            p: 4,
            textAlign: 'center'
        }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1e441f' }}>
                Onsite Registration is Currently Closed
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
                Please check back later or contact the administrator for more information.
            </Typography>
        </Card>
    );

    // Add utility function for capitalization
    const capitalizeWords = (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const calculateFee = (organization) => {
        return organization?.toLowerCase() === 'junior' ? 100 : 200;
    };

    const getTotalAmount = () => {
        return batch.reduce((sum, person) => sum + calculateFee(person.organization), 0);
    };

    // Loading component
    const LoadingDisplay = () => (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            flexDirection: 'column'
        }}>
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                width: '300px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shimmer 1.5s infinite'
                },
                '@keyframes shimmer': {
                    '0%': {
                        left: '-100%',
                    },
                    '100%': {
                        left: '100%',
                    }
                }
            }}>
                <Typography variant="h6" sx={{ 
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: '40px'
                }}>
                    Loading Onsite Registration Form...
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Container 
            maxWidth={false}
            sx={{ 
                py: 4,
                px: { xs: 2, sm: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <Box sx={{ 
                mb: 4,
                mt: { xs: 2, sm: 4 },
                textAlign: 'center'
            }}>
                <Typography 
                    variant="h1" 
                    gutterBottom
                    sx={{
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                >
                    EVFFBC Annual Conference 2025
                </Typography>
                <Typography 
                    variant="h3" 
                    color="white"
                    sx={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
                    }}
                >
                    Onsite Registration Form
                </Typography>
            </Box>
            <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <form onSubmit={handleSubmitAll}>
                        {/* New position for batch list and Add Another Person button */}
                        {batch.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ 
                                    p: 2, 
                                    borderRadius: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(30, 68, 31, 0.2)',
                                    mb: 2
                                }}>
                                    {/* ...existing batch list content... */}
                                    <Typography variant="h6" sx={{ mb: 2, color: '#1e441f', fontWeight: 600 }}>
                                            Added Participants ({batch.length}):
                                        </Typography>
                                        {batch.map((person, index) => (
                                            <Box 
                                                key={index} 
                                                sx={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    mb: 1,
                                                    borderBottom: '1px solid rgba(30, 68, 31, 0.1)',
                                                    '&:last-child': {
                                                        borderBottom: 'none'
                                                    }
                                                }}
                                            >
                                                <Box>
                                                    <Typography sx={{ color: '#1e441f', fontWeight: 500 }}>
                                                        {capitalizeWords(person.name)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#1e441f' }}>
                                                        {capitalizeWords(person.organization)} • {capitalizeWords(person.gender)} • Sector {person.sector}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleRemoveFromBatch(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        ))}
                                </Box>
                                <Box sx={{ 
                                    mt: 2, 
                                    p: 2, 
                                    borderTop: '1px solid rgba(30, 68, 31, 0.2)',
                                    textAlign: 'right'
                                }}>
                                    <Typography variant="h6" sx={{ color: '#1e441f' }}>
                                        Total Amount: ₱{getTotalAmount()}.00
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Registration fee: ₱200 per person (₱100 for Juniors)
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    Fill the form below to add more participants
                                </Typography>
                            </Box>
                        )}

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography 
                                    variant="h4" 
                                    gutterBottom
                                    sx={{ 
                                        color: '#1e441f',
                                        fontWeight: 600
                                    }}
                                >
                                    Personal Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    sx={customInputStyles}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Church Name"
                                    name="church"
                                    value={formData.church}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.church)}
                                    helperText={errors.church}
                                    sx={customInputStyles}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    sx={customInputStyles}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(errors.sector)}
                                    sx={customInputStyles}
                                >
                                    <InputLabel>Sector</InputLabel>
                                    <Select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleInputChange}
                                        label="Sector"
                                    >
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.sector && <FormHelperText>{errors.sector}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl 
                                    fullWidth 
                                    error={Boolean(errors.gender)}
                                    sx={customInputStyles}
                                >
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        label="Gender"
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                    {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl 
                                    fullWidth 
                                    error={Boolean(errors.organization)}
                                    sx={customInputStyles}
                                >
                                    <InputLabel>Organization</InputLabel>
                                    <Select
                                        name="organization"
                                        value={formData.organization || ''}
                                        onChange={handleInputChange}
                                        label="Organization"
                                    >
                                        <MenuItem value="junior">Junior (12 & below)</MenuItem>
                                        <MenuItem value="young people">Young People (13-21 years old)</MenuItem>
                                        <MenuItem value="single adult">Single Adult (22 & above)</MenuItem>
                                        <MenuItem value="laymen">Laymen</MenuItem>
                                        <MenuItem value="womisso">Womisso</MenuItem>
                                    </Select>
                                    {errors.organization && <FormHelperText>{errors.organization}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', md: 'row' },
                                    gap: 2, 
                                    justifyContent: 'center',
                                    mt: 2
                                }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleAddAnother}
                                        sx={{
                                            background: 'linear-gradient(135deg, #1e441f 0%, #2e682f 100%)',
                                            color: '#fff',
                                            height: '48px',
                                            order: { xs: 1, md: 0 }, // Changes order on mobile
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2e682f 0%, #1e441f 100%)',
                                            }
                                        }}
                                    >
                                        Add This Person
                                    </Button>
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        disabled={batch.length === 0 || isSubmitting}
                                        sx={{
                                            background: 'linear-gradient(135deg, #1e441f 0%, #2e682f 100%)',
                                            color: '#fff',
                                            height: '48px',
                                            order: { xs: 2, md: 0 }, // Changes order on mobile
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2e682f 0%, #1e441f 100%)',
                                            },
                                            '&.Mui-disabled': {
                                                background: 'rgba(30, 68, 31, 0.5)',
                                                color: 'rgba(255, 255, 255, 0.7)'
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'Submitting...' : `Submit All (${batch.length})`}
                                    </Button>
                                </Box>
                            </Grid>

                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    {/* Add a check animation component here */}
                    <p>Proceed to the cashier for the payment and registration confirmation.</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setSuccessDialogOpen(false);
                            navigate('/invoice');
                        }}
                    >
                        View Invoice
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OnsiteRegistration;
