import * as React from 'react';
import useRequest from './useRequest';

const useProductChangeHistory = (productId) => {
  const { getList } = useRequest();
  const [loading, setLoading] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [changeHistory, setChangeHistory] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await getList('product-change-histories', {
          pagination: {
            page: 1,
            perPage: 10,
          },
          sort: {
            field: 'id',
            order: 'ASC',
          },
          filter: {
            product: productId,
          },
        });
  
        setChangeHistory(data);
        setLoading(false);
      } catch (error) {
        setSnackbarMessage(error.message);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return  {
    changeHistory,
    loading,
    openSnackbar,
    handleSnackbarClose,
    snackbarMessage,
  };
}

export default useProductChangeHistory;
