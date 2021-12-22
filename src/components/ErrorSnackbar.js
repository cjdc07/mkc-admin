import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';

const ErrorSnackbar = ({open, onClose, message}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default ErrorSnackbar;
