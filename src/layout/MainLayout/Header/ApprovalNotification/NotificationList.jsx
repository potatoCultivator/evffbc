import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

// project-import
import Chip from 'ui-component/extended/Chip';

// ListItemWrapper component
const ListItemWrapper = ({ children, onClick }) => {
  return (
    <ButtonBase
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.light',
          },
        }}
      >
        {children}
      </Box>
    </ButtonBase>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
  const theme = useTheme();

  // Handle click event
  const handleClick = () => {
    console.log('Notification clicked!');
    // Add more logic here, such as navigating to a different page or opening a modal.
  };

  const chipSX = {
    height: 24,
    padding: '0 6px',
  };

  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px',
    '&:hover': {
      color: theme.palette.orange.light,
      backgroundColor: theme.palette.orange.dark,
    },
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    '&:hover': {
      color: theme.palette.success.light,
      backgroundColor: theme.palette.success.dark,
    },
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300,
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22,
        },
        '& .MuiDivider-root': {
          my: 0,
        },
        '& .list-container': {
          pl: 7,
        },
      }}
    >
      <ListItemWrapper onClick={handleClick}>
        <ListItem alignItems="center">
          <ListItemText primary="John Doe" />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                <Typography variant="caption" display="block" gutterBottom>
                  2 min ago
                </Typography>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="subtitle2">Waiting for confirmation</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Chip label="Decline" sx={chipErrorSX} />
              </Grid>
              <Grid item>
                <Chip label="Approved" sx={chipSuccessSX} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>

      <Divider />
    </List>
  );
};

export default NotificationList;
