import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserProvider } from './contexts/UserContext';
import Dashboard from './Dashboard';
import Inventory from './routes/inventory/Inventory';
import LoginPage from './routes/login/LoginPage';
import Users from './routes/users/Users';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="inventory" element={<Inventory />} />
            <Route path="users" element={<Users />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
