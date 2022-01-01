import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import { Navigate } from 'react-router-dom';
import ConfirmAlertDialog from '../../components/ConfirmAlertDialog';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import { USER_ROLES } from '../../constants';
import { UserContext } from '../../contexts/UserContext';
import useUsersState from '../../hooks/useUsersState';
import DialogUserForm from './DialogUserForm';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  { field: 'username', headerName: 'Username', flex: 1 },
  { field: 'firstName', headerName: 'First Name', flex: 1 },
  { field: 'lastName', headerName: 'Last Name', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'active', headerName: 'Is Active', flex: 1, type: 'boolean' },
];

export default function Users() {
  const {
    rows,
    openDialog,
    openAlert,
    handleAlertClose,
    confirmAlertTitle,
    confirmAlertMessage,
    confirmDelete,
    saveUser,
    editUser,
    deleteUser,
    handleDialogOpen,
    handleDialogClose,
    inputChange,
    formValues,
    formErrors,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
    saving,
    isUpdate,
    loading,
  } = useUsersState();
  const [pageSize, setPageSize] = React.useState(5);
  const { user } = React.useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== USER_ROLES.OWNER) {
    return <Navigate to="/inventory" />
  }

  const actionColumn = {
    field: 'action',
    headerName: 'Actions',
    type: 'actions',
    width: 150,
    getActions: (params) => [
      <IconButton
        onClick={(e) => editUser(e, params)}
        color="primary"
        aria-label="edit"
      >
        <EditIcon />
      </IconButton>,
      <IconButton
        onClick={(e) => confirmDelete(e, params)}
        color="error"
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>,
    ],
  };

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <Box sx={{display: 'inline-flex', width: '50%'}}>
          <h2>Users</h2>
        </Box>
        <Box sx={{display: 'inline-flex', width: '50%', justifyContent: 'flex-end'}}>
          <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleDialogOpen}>
            New User
          </Button>
        </Box>
        <DataGrid
          rows={rows}
          columns={[...columns, actionColumn]}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          loading={loading}
        />
      </div>
      <>
        <DialogUserForm
          open={openDialog}
          onClose={handleDialogClose}
          formValues={formValues}
          saving={saving}
          formErrors={formErrors}
          inputChange={inputChange}
          onSave={saveUser}
          isUpdate={isUpdate}
        />
        <ErrorSnackbar
          open={openSnackbar}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
        <ConfirmAlertDialog 
          title={confirmAlertTitle}
          open={openAlert}
          onCancel={handleAlertClose}
          onConfirm={deleteUser}
          message={confirmAlertMessage}
        />
      </>
    </>
  );
}
