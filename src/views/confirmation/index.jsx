import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import {
    Card,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    Button,
    Typography,
    IconButton,
    Chip,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
    OutlinedInput,
    InputAdornment
} from '@mui/material';
import { IconChevronDown, IconChevronUp, IconCheck, IconX, IconSearch } from '@tabler/icons-react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { motion, AnimatePresence } from 'framer-motion';
import { REGISTRATION_STATUS, STATUS_COLORS, STATUS_LABELS } from 'constants/status';

const Confirmation = () => {
    const [pendingRegistrations, setPendingRegistrations] = useState({});
    const [expandedCode, setExpandedCode] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null,
        registrants: null,
        title: '',
        message: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const confereeRef = collection(firestore, 'conferee');
        const q = query(confereeRef, where('status', '==', REGISTRATION_STATUS.PENDING));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groupedData = {};
            snapshot.docs.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                if (!groupedData[data.reference_code]) {
                    groupedData[data.reference_code] = [];
                }
                groupedData[data.reference_code].push(data);
            });
            setPendingRegistrations(groupedData);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const confereeRef = doc(firestore, 'conferee', id);
            await updateDoc(confereeRef, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleGroupStatusUpdate = async (registrants, newStatus) => {
        try {
            // Update all registrants under the same reference code
            const updatePromises = registrants.map(registrant => 
                updateDoc(doc(firestore, 'conferee', registrant.id), {
                    status: newStatus,
                    dateUpdated: new Date()
                })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Error updating group status:', error);
        }
    };

    const handleConfirmAction = async () => {
        const totalAmount = confirmDialog.registrants?.reduce((sum, registrant) => 
            sum + calculateFee(registrant.organization), 0) || 0;
            
        if (confirmDialog.action && confirmDialog.registrants) {
            await handleGroupStatusUpdate(confirmDialog.registrants, confirmDialog.action);
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };

    const showConfirmDialog = (registrants, action) => {
        const isApprove = action === REGISTRATION_STATUS.APPROVED;
        setConfirmDialog({
            open: true,
            action,
            registrants,
            title: `${isApprove ? 'Approve' : 'Decline'} Registration`,
            message: `Are you sure you want to ${isApprove ? 'approve' : 'decline'} ${registrants.length} registrant${registrants.length > 1 ? 's' : ''}? This action cannot be undone.`
        });
    };

    // Add formatting utilities
    const formatName = (name) => {
        return name
            ?.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || '';
    };

    const formatText = (text) => {
        return text?.charAt(0).toUpperCase() + text?.slice(1) || '';
    };

    const formatRefCode = (code) => {
        return code?.toUpperCase() || '';
    };

    const calculateFee = (organization) => {
        return organization?.toLowerCase() === 'junior' ? 100 : 200;
    };

    const StatusChip = ({ status }) => (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', sm: 'flex-end' }
        }}>
            <Typography 
                variant="caption" 
                color="textSecondary"
                sx={{ 
                    mb: 0.5,
                    fontSize: '0.75rem',
                    textAlign: { xs: 'left', sm: 'right' },
                    width: '100%'
                }}
            >
                Payment Status
            </Typography>
            <Chip 
                label={STATUS_LABELS[status]}
                color={STATUS_COLORS[status]}
                size="small"
                sx={{ 
                    minWidth: { xs: '100%', sm: '140px' },
                    height: 32,
                    '& .MuiChip-label': {
                        px: 2,
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        width: '100%',
                        textAlign: 'center'
                    }
                }}
            />
        </Box>
    );

    const ReferenceRow = ({ reference_code, registrants }) => {
        const isExpanded = expandedCode === reference_code;
        const totalAmount = registrants.reduce((sum, registrant) => 
            sum + calculateFee(registrant.organization), 0);

        const LabelValue = ({ label, value }) => (
            <Box>
                <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ 
                        display: 'block',
                        mb: 0.5,
                        fontSize: '0.75rem'
                    }}
                >
                    {label}
                </Typography>
                <Typography 
                    variant="body2"
                    sx={{ 
                        fontWeight: 500,
                        color: 'text.primary',
                        wordBreak: 'break-word'
                    }}
                >
                    {value}
                </Typography>
            </Box>
        );

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
            >
                <Card 
                    sx={{ 
                        mb: { xs: 2, sm: 3 },
                        overflow: 'visible', // Changed from 'hidden' to prevent text cutoff
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: { xs: 1, sm: 2 },
                        boxShadow: isExpanded ? 
                            '0 8px 32px rgba(30, 68, 31, 0.08)' : 
                            '0 2px 8px rgba(30, 68, 31, 0.04)',
                        border: '1px solid',
                        borderColor: isExpanded ? 'primary.light' : 'grey.200',
                        '&:hover': {
                            borderColor: 'primary.main',
                            transform: { xs: 'none', sm: 'translateY(-2px)' },
                        }
                    }}
                    onClick={() => setExpandedCode(isExpanded ? null : reference_code)}
                >
                    <Box sx={{ 
                        p: { xs: 2.5, sm: 3 }, // Increased padding
                        background: isExpanded ? 'linear-gradient(45deg, rgba(30, 68, 31, 0.02), rgba(30, 68, 31, 0.05))' : 'none'
                    }}>
                        <Grid container spacing={3}> {/* Increased spacing */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                                    <Typography 
                                        variant="h5" 
                                        color="primary" 
                                        gutterBottom
                                        sx={{ 
                                            fontSize: { xs: '0.7rem', sm: '1.0rem' },
                                            lineHeight: 1.4,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        Gcash Reference Code: {formatRefCode(reference_code)}
                                    </Typography>
                                    <Stack 
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    >
                                        <Chip 
                                            label={`${registrants.length} Registrants`}
                                            color="primary"
                                            size="small"
                                            sx={{ maxWidth: '100%', height: 28 }}
                                        />
                                        <Typography 
                                            variant="subtitle1" 
                                            color="primary"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            ₱{totalAmount.toLocaleString()}.00
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1.5, sm: 2 },
                                    justifyContent: 'flex-end',
                                    mt: { xs: 1, sm: 0 }
                                }}>
                                    <Button
                                        fullWidth={!isExpanded}
                                        variant="contained"
                                        color="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showConfirmDialog(registrants, REGISTRATION_STATUS.APPROVED);
                                        }}
                                        startIcon={<IconCheck size={18} />}
                                        sx={{ flex: { xs: '1', sm: '0 1 auto' } }}
                                    >
                                        Approve All
                                    </Button>
                                    <Button
                                        fullWidth={!isExpanded}
                                        variant="outlined"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showConfirmDialog(registrants, REGISTRATION_STATUS.DECLINED);
                                        }}
                                        startIcon={<IconX size={18} />}
                                        sx={{ flex: { xs: '1', sm: '0 1 auto' } }}
                                    >
                                        Decline All
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Divider />
                                <Box sx={{ 
                                    p: { xs: 2.5, sm: 3 },
                                    bgcolor: 'grey.50'
                                }}>
                                    <Grid container spacing={2.5}> {/* Increased spacing */}
                                        {registrants.map((registrant, index) => (
                                            <Grid item xs={12} key={registrant.id}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Card 
                                                        variant="outlined"
                                                        sx={{ 
                                                            p: { xs: 2, sm: 2.5 },
                                                            '&:hover': {
                                                                borderColor: 'primary.main',
                                                                bgcolor: 'background.paper'
                                                            }
                                                        }}
                                                    >
                                                        <Grid 
                                                            container 
                                                            spacing={2.5} 
                                                            alignItems="flex-start"
                                                        >
                                                            <Grid item xs={12} md={3}>
                                                                <Stack spacing={2}>
                                                                    <LabelValue 
                                                                        label="Full Name"
                                                                        value={formatName(registrant.name)}
                                                                    />
                                                                    <LabelValue 
                                                                        label="Email Address"
                                                                        value={registrant.email}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Stack spacing={2}>
                                                                    <LabelValue 
                                                                        label="Organization"
                                                                        value={formatName(registrant.organization)}
                                                                    />
                                                                    <LabelValue 
                                                                        label="Church Sector"
                                                                        value={`Sector ${registrant.sector}`}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Stack spacing={2}>
                                                                    <LabelValue 
                                                                        label="Church Name"
                                                                        value={formatName(registrant.church) || 'Not specified'}
                                                                    />
                                                                    <LabelValue 
                                                                        label="Gender"
                                                                        value={formatText(registrant.gender)}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={3}>
                                                                <Box sx={{ 
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'center',
                                                                    alignItems: { xs: 'stretch', sm: 'flex-end' },
                                                                    mt: { xs: 2, sm: 0 }
                                                                }}>
                                                                    <StatusChip status={registrant.status} />
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        );
    };

    const totalPendingCount = useMemo(() => {
        return Object.values(pendingRegistrations).reduce((acc, group) => acc + group.length, 0);
    }, [pendingRegistrations]);

    const filteredRegistrations = useMemo(() => {
        if (!searchQuery) return pendingRegistrations;

        const searchLower = searchQuery.toLowerCase();
        const filtered = {};

        Object.entries(pendingRegistrations).forEach(([refCode, registrants]) => {
            // Check if any registrant in the group matches the search criteria
            const hasMatch = registrants.some(reg => 
                reg.name?.toLowerCase().includes(searchLower) ||
                reg.email?.toLowerCase().includes(searchLower) ||
                reg.church?.toLowerCase().includes(searchLower) ||
                reg.organization?.toLowerCase().includes(searchLower) ||
                reg.sector?.toString().includes(searchLower) ||
                refCode.toLowerCase().includes(searchLower)
            );

            // If there's a match, include the entire group
            if (hasMatch) {
                filtered[refCode] = registrants;
            }
        });

        return filtered;
    }, [pendingRegistrations, searchQuery]);

    return (
        <>
            <MainCard 
                title={
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography 
                                variant="h3" 
                                sx={{ color: 'rgb(30, 68, 31)' }}
                            >
                                Pending Registrations 
                                <Typography
                                    component="span"
                                    variant="h3"
                                    sx={{
                                        ml: 2,
                                        bgcolor: 'rgb(30, 68, 31)',
                                        color: '#fff',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '24px',
                                        fontSize: '1.1rem',
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    {totalPendingCount}
                                </Typography>
                            </Typography>
                        </Box>
                        <OutlinedInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search registrants..."
                            size="small"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1rem" />
                                </InputAdornment>
                            }
                            sx={{
                                minWidth: { xs: '100%', sm: '300px' },
                                maxWidth: '400px',
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(30, 68, 31, 0.2)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(30, 68, 31, 0.3)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgb(30, 68, 31)'
                                }
                            }}
                        />
                    </Box>
                }
                sx={{
                    backgroundImage: 'linear-gradient(to right bottom, rgba(30, 68, 31, 0.02), rgba(30, 68, 31, 0.05))',
                    '& .MuiCardContent-root': {
                        p: { xs: 1, sm: 2, md: 3 }
                    }
                }}
            >
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {Object.keys(filteredRegistrations).length === 0 ? (
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="textSecondary">
                                {searchQuery ? 'No matching registrations found' : 'No pending registrations found'}
                            </Typography>
                        </Card>
                    ) : (
                        Object.entries(filteredRegistrations).map(([refCode, registrants]) => (
                            <ReferenceRow 
                                key={refCode} 
                                reference_code={refCode} 
                                registrants={registrants}
                            />
                        ))
                    )}
                </Box>
            </MainCard>

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <Alert 
                        severity={confirmDialog.action === REGISTRATION_STATUS.APPROVED ? "success" : "warning"}
                        sx={{ mb: 2 }}
                    >
                        {confirmDialog.message}
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        Total amount: ₱{(confirmDialog.registrants?.length || 0) * 200}.00
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        variant="contained"
                        color={confirmDialog.action === REGISTRATION_STATUS.APPROVED ? "success" : "error"}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Confirmation;
