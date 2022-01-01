import { stringify } from 'query-string';

const apiUrl = process.env.REACT_APP_API_URL;

const useRequest = () => ({
  getOne: (resource, params) =>
    fetch(`${apiUrl}/${resource}/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(response => response.json())
      .then((data) => ({
        data,
      })
    ),

  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, perPage]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  },

  create: async (resource, data) => {
    const response = await fetch(`${apiUrl}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  },

  update: async (resource, data) => {
    const response = await fetch(`${apiUrl}/${resource}/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  },

  deleteOne: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }
  },
});

export default useRequest;
