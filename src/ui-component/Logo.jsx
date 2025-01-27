// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import logo from 'assets/images/logo.png';

const Logo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img src={logo} alt="Logo" style={{ height: 40 }} />
      <Typography 
        variant="h5" 
        sx={{ 
          color: theme.palette.primary.main,
          fontFamily: theme.typography.fontFamily
        }}
      >
        EVFFBC Registration System
      </Typography>
    </Box>
  );
};

export default Logo;
