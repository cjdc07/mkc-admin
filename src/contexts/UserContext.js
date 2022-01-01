import * as React from 'react';
import useAuth from '../hooks/useAuth';

const UserContext = React.createContext();


const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const { check } = useAuth();

  React.useEffect(() => {
    check()
      .then(user => setUser(user))
      .catch(() => {
        setUser(null);
        localStorage.removeItem('access_token');
      });
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
