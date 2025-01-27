import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Container, Typography, useMediaQuery, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import themes from 'themes';

const Error404 = () => {
  const customization = useSelector((state) => state.customization);
  const theme = themes(customization);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const getHomeRoute = () => {
    const user = localStorage.getItem('user');
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.email === 'evffbcannualconference@gmail.com') {
        return '/dashboard';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return '/prereg';
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa' // Fallback color
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              <Typography
                variant="h2"
                sx={{
                  color: '#1e441f',
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                EVFFBC Annual Conference
              </Typography>
              <Typography
                variant={matchDownSM ? 'h1' : 'h1'}
                sx={{
                  fontSize: { xs: '8rem', sm: '12rem', md: '16rem' },
                  fontWeight: 900,
                  color: '#1e441f',
                  opacity: 0.1,
                }}
              >
                404
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: '60%', // Adjusted to account for new title
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%'
                }}
              >
                <Typography
                  variant={matchDownSM ? 'h4' : 'h3'}
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    color: '#1e441f'
                  }}
                >
                  Page Not Found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 4, 
                    maxWidth: '600px', 
                    mx: 'auto',
                    color: '#666'
                  }}
                >
                  The page you're looking for doesn't exist or has been removed.
                  Please check the URL or return to the homepage.
                </Typography>
                <AnimateButton>
                  <Button
                    component={Link}
                    to={getHomeRoute()}
                    variant="contained"
                    sx={{
                      bgcolor: '#1e441f',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#2e682f'
                      }
                    }}
                    size="large"
                  >
                    Back to Home
                  </Button>
                </AnimateButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Error404;
