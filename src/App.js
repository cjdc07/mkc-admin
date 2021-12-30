import * as React from 'react';
import './App.css';
import { UserProvider } from './contexts/UserContext';
import Dashboard from './Dashboard';
import LoginPage from './routes/login/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div className="App">
      <UserProvider user={{name: 'cj'}}>
        {isLoggedIn ? <Dashboard /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
      </UserProvider>
    </div>
  );
}

export default App;
