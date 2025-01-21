import React from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';

const RegisteredConferee = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h2" gutterBottom>
              Registered Conferees List
            </Typography>
            <Typography variant="body1">
              View and manage all registered conferees here.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RegisteredConferee;
