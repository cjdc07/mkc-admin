import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import useInventoryState from '../../hooks/useInventoryState';
import ConfirmAlertDialog from '../../components/ConfirmAlertDialog';
import DialogProductForm from './DialogProductForm';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'pricePerUnit',
    headerName: 'Price per unit',
    type: 'number',
    width: 125,
    valueFormatter: ({value}) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value),
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
  },
  {
    field: 'unit',
    headerName: 'Unit',
  },
  {
    field: 'createdAt',
    headerName: 'Date Created',
    type: 'dateTime',
    flex: 1,
    valueFormatter: ({value}) => 
      new Date(value).toLocaleString("en", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
  },
  {
    field: 'updatedAt',
    headerName: 'Date Updated',
    type: 'dateTime',
    flex: 1,
    valueFormatter: ({value}) => 
      new Date(value).toLocaleString("en", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
  },
];

export default function Inventory() {
  const {
    rows,
    deleteProduct,
    handleDialogOpen,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
    editRow,
    openDialog,
    handleDialogClose,
    openAlert,
    handleAlertClose,
    confirmDelete,
    confirmAlertTitle,
    confirmAlertMessage,
    formValues,
    saving,
    formErrors,
    inputChange,
    saveProduct,
    isUpdate,
  } = useInventoryState();

  const [pageSize, setPageSize] = React.useState(5);

  const actionColumn = {
    field: 'action',
    headerName: 'Actions',
    type: 'actions',
    width: 150,
    getActions: (params) => [
      <IconButton
        onClick={(e) => console.log('show history')}
        color="primary"
        aria-label="show-history"
      >
        <HistoryIcon />
      </IconButton>,
      <IconButton
        onClick={(e) => editRow(e, params)}
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
          <h2>Inventory</h2>
        </Box>
        <Box sx={{display: 'inline-flex', width: '50%', justifyContent: 'flex-end'}}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            New Product
          </Button>
        </Box>
        <DataGrid
          rows={rows}
          columns={[...columns, actionColumn]}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </div>
      <>
        <DialogProductForm
          open={openDialog}
          onClose={handleDialogClose}
          formValues={formValues}
          saving={saving}
          formErrors={formErrors}
          inputChange={inputChange}
          saveProduct={saveProduct}
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
          onConfirm={deleteProduct}
          message={confirmAlertMessage}
        />
      </>
    </>
  );
}

