import * as React from 'react';
import useRequest from "./useRequest";

const defaultFormValues = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  role: '',
  active: true,
};

const useUsersState = () => {
  const { getList, create, deleteOne, update } = useRequest();
  const [rows, setRows] = React.useState([]);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [confirmAlertTitle, setConfirmAlertTitle] = React.useState(null);
  const [confirmAlertMessage, setConfirmAlertMessage] = React.useState(null);
  const [formValues, setFormValues] = React.useState(defaultFormValues);
  const [formErrors, setFormErrors] = React.useState({});
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await getList('users', {
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

  const handleDialogClose = () => {
    setOpenSnackbar(false);
    setOpenDialog(false);
    setSnackbarMessage(null);
    setFormValues(defaultFormValues);
    setFormErrors({});
    setIsUpdate(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAlertClose = () => {
    setCurrentRow(null);
    setOpenAlert(false);
    setConfirmAlertTitle(null);
    setConfirmAlertMessage(null);
  };

  const confirmDelete = async (e, params) => {
    e.stopPropagation();
    setOpenAlert(true);
    setCurrentRow(params.row);
    setConfirmAlertTitle(`Delete ${params.row.username}`);
    setConfirmAlertMessage(`Are you sure you want to delete ${params.row.username}?`)
  }

  const saveUser = async () => {
    setSaving(true);

    Object.keys(formValues).forEach((key) => {
      if (typeof formValues[key] === 'string') {
        formValues[key] = formValues[key].trim();
      }
    });

    const errors = Object.keys(formValues).reduce((acc, key) => {
      if (key === 'active') {
        return acc;
      }

      if (formValues[key] === '') {
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
        const product = await update('users', formValues);
        const index = rows.findIndex(({ id }) => id === product.id );
        const updatedRow = [...rows];
        updatedRow[index] = product;
        setRows(updatedRow);
        setIsUpdate(false);
      } else {
        const product = await create('users', formValues);
        setRows([...rows, product]);
      }
      handleDialogClose();
      setSaving(false);
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

  const editUser = async (e, params) => {
    e.stopPropagation();
    const { row } = params;
    setFormValues({
      id: row.id,
      username: row.username,
      firstName: row.firstName,
      lastName: row.lastName,
      password: row.password,
      role: row.role,
      active: row.active,
    });
    setIsUpdate(true);
    handleDialogOpen();
  }

  const deleteUser = async () => {
    try {
      await deleteOne('users', currentRow);
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

  const inputChange = (e, inputId = null) => {
    let {id, value} = e.target;
    
    if (inputId) {
      id = inputId;
    }

    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    }

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
  }
}

export default useUsersState;
