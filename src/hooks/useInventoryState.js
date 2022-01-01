import * as React from 'react';

import useRequest from '../hooks/useRequest';

const defaultFormValues = {
  name: '',
  pricePerUnit: 0,
  quantity: 0,
  unit: '',
};

const useInventoryState = () => {
  const { getList, create, deleteOne, update } = useRequest();
  const [rows, setRows] = React.useState([]);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [confirmAlertTitle, setConfirmAlertTitle] = React.useState(null);
  const [confirmAlertMessage, setConfirmAlertMessage] = React.useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [formValues, setFormValues] = React.useState(defaultFormValues);
  const [formErrors, setFormErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isUpdate, setIsUpdate] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await getList('products', {
          pagination: {
            page: 1,
            perPage: 10,
          },
          sort: {
            field: 'id',
            order: 'ASC',
          },
          filter: {},
        });

        setRows(data);
        setLoading(false);
      } catch (error) {
        if (error.statusCode !== 401) {
          setSnackbarMessage(error.message);
          setOpenSnackbar(true);
          setLoading(false);
        }
      }
    }

    fetchData();

  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleDrawerClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage(null);
    setCurrentRow(null);
    setOpenDrawer(false);
  };

  const handleAlertClose = () => {
    setCurrentRow(null);
    setOpenAlert(false);
    setConfirmAlertTitle(null);
    setConfirmAlertMessage(null);
  };

  const handleDialogClose = () => {
    setOpenSnackbar(false);
    setOpenDialog(false);
    setSnackbarMessage(null);
    setFormValues(defaultFormValues);
    setFormErrors({});
    setIsUpdate(false);
  };

  const confirmDelete = async (e, params) => {
    e.stopPropagation();
    setOpenAlert(true);
    setCurrentRow(params.row);
    setConfirmAlertTitle(`Delete ${params.row.name}`);
    setConfirmAlertMessage(`Are you sure you want to delete ${params.row.name}?`)
  }

  const deleteProduct = async () => {
    try {
      await deleteOne('products', currentRow);
      const { id } = currentRow;
      const updatedRows = rows.filter((product) => product.id !== id);
      setRows(updatedRows);
      handleAlertClose();
    } catch (error) {
      if (error.statusCode !== 401) {
        setSnackbarMessage(error.message);
        setOpenSnackbar(true);
        handleAlertClose();
      }
    }
  };

  const saveProduct = async () => {
    setSaving(true);

    Object.keys(formValues).forEach((key) => {
      if (typeof formValues[key] === 'string') {
        formValues[key] = formValues[key].trim();
      }
    });

    const errors = Object.keys(formValues).reduce((acc, key) => {
      if (!formValues[key] || formValues[key] === '') {
        acc[key] = 'This field is required.';
      }

      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      setFormErrors({...formErrors, ...errors});
      setSaving(false);
      return;
    }

    try {
      if (isUpdate) {
        const product = await update('products', formValues);
        const index = rows.findIndex(({ id }) => id === product.id );
        const updatedRow = [...rows];
        updatedRow[index] = product;
        setRows(updatedRow);
        setIsUpdate(false);
      } else {
        const product = await create('products', formValues);
        setRows([...rows, product]);
      }
      handleDialogClose();
      setSaving(false);
      if (isUpdate) {
        setIsUpdate(false);
      }
    } catch (error) {
      if (error.statusCode !== 401) {
        setSnackbarMessage(error.message);
        setOpenSnackbar(true);
        setSaving(false);
        if (isUpdate) {
          setIsUpdate(false);
        }
      }
    }
  }

  const editProduct = async (e, params) => {
    e.stopPropagation();
    const { row } = params;
    setFormValues({
      id: row.id,
      name: row.name,
      pricePerUnit: row.pricePerUnit,
      quantity: row.quantity,
      unit: row.unit,
    });
    setIsUpdate(true);
    handleDialogOpen();
  }

  const showProductChangeHistory = async (e, params) => {
    e.stopPropagation();
    setCurrentRow(params.row);
    setOpenDrawer(true);
  }

  const inputChange = (e) => {
    const {id, value} = e.target;

    if (!value || value === '') {
      setFormErrors({
        ...formErrors,
        [id]: 'This field is required.'
      });
    } else {
      setFormErrors({...formErrors, [id]: null});
    }

    setFormValues({ ...formValues, [id]: value });
  }

  return {
    rows,
    openDialog,
    deleteProduct,
    saveProduct,
    handleDialogOpen,
    handleDialogClose,
    inputChange,
    formValues,
    formErrors,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
    saving,
    editProduct,
    openAlert,
    handleAlertClose,
    confirmDelete,
    confirmAlertTitle,
    confirmAlertMessage,
    isUpdate,
    showProductChangeHistory,
    openDrawer,
    handleDrawerClose,
    currentRow,
    loading,
  }
}

export default useInventoryState;
