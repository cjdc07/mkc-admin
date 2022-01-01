import * as React from 'react';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, TextField, Typography } from '@mui/material';

import useLoginPageState from '../../hooks/useLoginPageState';
import { UserContext } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';


const LoginPage = () => {
  const {
    formErrors,
    inputChange,
    onLogin,
    loading,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
  } = useLoginPageState();

  const { user, setUser } = React.useContext(UserContext);

  if (user) {
    // TODO: Navigate to page where user was trying to access
    return <Navigate to="/inventory" />
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom component="div">
          MKC Admin
        </Typography>
        <TextField
          required
          autoFocus
          error={!!formErrors['username']}
          helperText={formErrors['username']}
          margin="normal"
          id="username"
          label="Username"
          type="text"
          variant="outlined"
          style={{ width: '320px' }}
          onChange={inputChange}
        />
        <TextField
          required
          error={!!formErrors['password']}
          helperText={formErrors['password']}
          margin="normal"
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          style={{ width: '320px' }}
          onChange={inputChange}
        />
        {loading ? (
          <LoadingButton
            loading={true}
            style={{ width: '320px', marginTop: '16px' }}
          />
        ) : (
          <Button
            startIcon={<LoginIcon />}
            variant="contained"
            style={{ width: '320px', marginTop: '16px' }}
            onClick={async () => {
              const {access_token, user} = await onLogin();
              if (user) {
                setUser(user);
                localStorage.setItem('access_token', access_token);
              }
            }}
          >
            Login
          </Button>
        )}
      </Box>
      <ErrorSnackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default LoginPage;
