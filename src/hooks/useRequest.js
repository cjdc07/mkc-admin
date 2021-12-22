import { stringify } from 'query-string';

const apiUrl = process.env.REACT_APP_API_URL;

const useRequest = () => ({
  getOne: (resource, params) =>
    fetch(`${apiUrl}/${resource}/${params.id}`)
      .then(response => response.json())
      .then((data) => ({
        data,
      })
    ),

  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, perPage]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return fetch(url)
      .then(response => response.json())
      .then(({data, total}) => ({
        data,
        total,
      })
    );
  },

  create: async (resource, data) => {
    const response = await fetch(`${apiUrl}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    });

    if (!response.ok) {
      console.log('not ok')
      throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }
  },

  // deleteMany: (resource, params) => {
  //   const query = {
  //     filter: JSON.stringify({ id: params.ids }),
  //   };
  //   return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
  //     method: 'DELETE',
  //   }).then(({ json }) => ({ data: json }));
  // },
});

export default useRequest;
