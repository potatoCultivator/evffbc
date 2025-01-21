import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const PublicLayout = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgb(30, 68, 31) 0%, rgb(255, 237, 71) 100%)',
                '& .MuiCard-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                    }
                },
                '& .MuiMenuItem-root': {
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                '& .MuiSelect-select': {
                    color: '#fff'
                },
                '& .MuiFormHelperText-root': {
                    color: '#FFD700'
                }
            }}
        >
            <Outlet />
        </Box>
    );
};

export default PublicLayout;
