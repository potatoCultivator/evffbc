import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
// import Customization from '../Customization';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const matchDownSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <>
      {!matchDownSm && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Outlet />
        </Container>
      )}
      {matchDownSm && <Outlet />}
    </>
  );
};

export default MinimalLayout;
