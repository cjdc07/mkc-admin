import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Box, Button, Dialog, DialogContent, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import useInventoryState from '../../hooks/useInventoryState';
import ConfirmAlertDialog from '../../components/ConfirmAlertDialog';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Inventory() {
  const {
    rows,
    deleteProduct,
    saveProduct,
    handleDialogOpen,
    handleDialogClose,
    inputChange,
    openDialog,
    formErrors,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
    saving,
    editRow,
    formValues,
    openAlert,
    handleAlertClose,
    confirmDelete,
    confirmAlertTitle,
    confirmAlertMessage,
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
      <div>
        <Dialog
          fullScreen
          open={openDialog}
          onClose={handleDialogClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDialogClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add new product
              </Typography>
              <LoadingButton
                loading={saving}
                autoFocus
                color="inherit"
                onClick={saveProduct}
                startIcon={<SaveIcon />}
              >
                save
              </LoadingButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <TextField
              required
              autoFocus
              error={!!formErrors['name']}
              helperText={formErrors['name']}
              margin="normal"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              onChange={inputChange}
              value={formValues.name}
            />
            <TextField
              required
              error={!!formErrors['pricePerUnit']}
              helperText={formErrors['pricePerUnit']}
              margin="normal"
              id="pricePerUnit"
              label="Price per unit"
              type="number"
              fullWidth
              variant="outlined"
              onChange={inputChange}
              value={formValues.pricePerUnit}
            />
            <TextField
              required
              error={!!formErrors['quantity']}
              helperText={formErrors['quantity']}
              margin="normal"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              onChange={inputChange}
              value={formValues.quantity}
            />
            <TextField
              required
              error={!!formErrors['unit']}
              helperText={formErrors['unit']}
              margin="normal"
              id="unit"
              label="Unit"
              type="text"
              fullWidth
              variant="outlined"
              onChange={inputChange}
              value={formValues.unit}
            />
          </DialogContent>
        </Dialog>
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
      </div>
    </>
  );
}

