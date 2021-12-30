const apiUrl = process.env.REACT_APP_API_URL;

const useAuth = () => ({
  login: async (data) => {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { message, statusCode } = await response.json();
      throw new Error(`An error occured: ${message} (${statusCode})`);
    }

    return await response.json();
  },
});

export default useAuth;
