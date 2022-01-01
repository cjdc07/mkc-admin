import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import useProductChangeHistory from '../../hooks/useProductChangeHistory';
import { UserContext } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';

const ProductChangeHistory = ({ open, onClose, product }) => {
  const {
    changeHistory,
    loading,
    openSnackbar,
    handleSnackbarClose,
    snackbarMessage,
  } = useProductChangeHistory(product.id);

  const { user } = React.useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />
  }

  return ( 
    <>      
      <Drawer
        anchor={'right'}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '400px',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Toolbar />
        {loading ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <h3 style={{marginBottom: 0}}>{product.name} Change History</h3>
            <Timeline>
              {changeHistory.map(({id, createdAt, createdFrom, description}, index) => (
                <TimelineItem key={id}>
                  <TimelineOppositeContent>
                  <Stack spacing={1}>
                    <Typography variant="body2">{
                    new Date(createdAt).toLocaleString("en", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">SOME USER</Typography>
                  </Stack>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  {index < changeHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Stack spacing={1}>
                    <Typography variant="body2">{description}</Typography>
                    <Typography variant="caption" color="text.secondary">{createdFrom}</Typography>
                  </Stack>
                  </TimelineContent>
              </TimelineItem>
              ))}
            </Timeline>
          </>
        )}
      </Drawer>
      <ErrorSnackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </> 
  );
}

export default ProductChangeHistory;
