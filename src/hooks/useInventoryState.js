import * as React from 'react';
import * as _ from 'lodash';

import useRequest from '../hooks/useRequest';

const defaultFormValues = {
  code: '',
  name: '',
  srp1: 0,
  srp2: 0,
  wholesalePrice: 0,
  distributorPrice: 0,
  quantity: 0,
  unit: '',
};

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE = 0;

const useInventoryState = () => {
  const { getList, create, deleteOne, update } = useRequest();
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = React.useState({});
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
  const [loading, setLoading] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);

  const setFilterValue = (filter) => setFilter(filter);
  const setFilterValueDebounced = React.useRef(_.debounce(setFilterValue, 500));

  React.useEffect(() => {
    fetchList();
  }, [page, pageSize, filter]);

  const fetchList = async () => {
    setRows([]);
    setLoading(true);

    try {
      const {data, total} = await getList('products', {
        pagination: {
          page,
          perPage: pageSize,
        },
        sort: {
          field: 'id',
          order: 'ASC',
        },
        filter,
      });

      setRows(data);
      setTotal(total);
      setLoading(false);
    } catch (error) {
      if (error.statusCode !== 401) {
        setSnackbarMessage(error.message);
        setOpenSnackbar(true);
        setLoading(false);
      }
    }
  }

  const onFilterChange = (e) => {
    const filter = {
      code: e.target.value,
      name: e.target.value,
    };

    setFilterValueDebounced.current(filter);
  }

  const changePage = (newPage) => setPage(newPage);

  const changePageSize = (newPageSize) =>
    setPageSize(newPageSize);

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
      handleAlertClose();
      await deleteOne('products', currentRow);
      await fetchList()
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
        await update('products', formValues);
        await fetchList();
        setIsUpdate(false);
      } else {
        await create('products', formValues);
        await fetchList();
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
        if (isUpdate && error.statusCode !== 400) {
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
      code: row.code,
      name: row.name,
      srp1: row.srp1,
      srp2: row.srp2,
      wholesalePrice: row.wholesalePrice,
      distributorPrice: row.distributorPrice,
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
    page,
    changePage,
    pageSize,
    changePageSize,
    total,
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
    onFilterChange,
  }
}

export default useInventoryState;
