import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Navigate } from 'react-router-dom';

import ConfirmAlertDialog from '../../components/ConfirmAlertDialog';
import DialogProductForm from './DialogProductForm';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import ProductHistoryDrawer from './ProductChangeHistory';
import QuickSearchToolbar from '../../components/QuickSearchToolbar';
import useInventoryState from '../../hooks/useInventoryState';
import { UserContext } from '../../contexts/UserContext';
import { USER_ROLES } from '../../constants';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  {
    field: 'code',
    headerName: 'Code',
    flex: 1,
    renderCell: (params) =>  {
      if (params.row.code.length > 10) {
        return (
          <Tooltip
            title={params.row.code}
            placement="top"
          >
            <span className="table-cell-trucate">
              {`${params.row.code.substring(0,10)} ...`}
            </span>
          </Tooltip>
        );
      }

      return params.row.code;
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 3,
    renderCell: (params) =>  {
      if (params.row.name.length > 30) {
        return (
          <Tooltip
            title={params.row.name}
            placement="top"
          >
            <span className="table-cell-trucate">
              {`${params.row.name.substring(0,30)} ...`}
            </span>
          </Tooltip>
        );
      }

      return params.row.name;
    },
  },
  {
    field: 'srp1',
    headerName: 'SRP1',
    type: 'number',
    flex: 1,
    valueFormatter: ({value}) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value),
  },
  {
    field: 'srp2',
    headerName: 'SRP2',
    type: 'number',
    flex: 1,
    valueFormatter: ({value}) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value),
  },
  {
    field: 'wholesalePrice',
    headerName: 'Wholesale Price',
    type: 'number',
    flex: 1,
    valueFormatter: ({value}) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value),
  },
  {
    field: 'distributorPrice',
    headerName: 'Distributor Price',
    type: 'number',
    flex: 1,
    valueFormatter: ({value}) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value),
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    flex: 1,
  },
  {
    field: 'unit',
    headerName: 'Unit',
    flex: 1,
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
    hide: true,
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
    hide: true,
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
    editProduct,
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
    showProductChangeHistory,
    openDrawer,
    handleDrawerClose,
    currentRow,
    loading,
    page,
    changePage,
    pageSize,
    changePageSize,
    total,
    onFilterChange,
  } = useInventoryState();

  const { user } = React.useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />
  }

  const renderActions = (params) => {
    const actions = [
      <IconButton
        onClick={(e) => showProductChangeHistory(e, params)}
        color="primary"
        aria-label="show-history"
      >
        <HistoryIcon />
      </IconButton>,
    ];

    if ([USER_ROLES.OWNER, USER_ROLES.EDITOR].includes(user.role)) {
      actions.push(
        <IconButton
          onClick={(e) => editProduct(e, params)}
          color="primary"
          aria-label="edit"
        >
        <EditIcon />
      </IconButton>
      );
    }

    if (user.role === USER_ROLES.OWNER) {
      actions.push(
        <IconButton
          onClick={(e) => confirmDelete(e, params)}
          color="error"
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      );
    }

    return actions
  }

  const actionColumn = {
    field: 'action',
    headerName: 'Actions',
    type: 'actions',
    width: 150,
    getActions: (params) => renderActions(params),
  };

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <h2>Inventory</h2>
        <Box sx={{
          display: 'inline-flex',
          width: '50%',
          paddingBottom: '16px',
        }}>
          <QuickSearchToolbar
            onChange={onFilterChange}
            placeholder={'Search product code or name ...'}
          />
        </Box>
        {[USER_ROLES.OWNER, USER_ROLES.EDITOR].includes(user.role) && (
          <Box sx={{display: 'inline-flex', width: '50%', justifyContent: 'flex-end'}}>
            
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleDialogOpen}>
              New Product
            </Button>
          </Box>
        )}
        <DataGrid
          disableColumnFilter
          page={page}
          rows={rows}
          columns={[...columns, actionColumn]}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
          loading={loading}
          rowCount={total}
          paginationMode='server'
        />
      </div>
      <>
        {(openDrawer && currentRow) && (
          <ProductHistoryDrawer
            open={openDrawer}
            onClose={handleDrawerClose}
            product={currentRow}
          />
        )}
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

