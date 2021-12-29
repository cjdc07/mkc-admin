import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Inventory from './routes/inventory/Inventory';
import Users from './routes/users/Users';

const drawerWidth = 240;

export default function Dashboard() {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MKC Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Link
              to="/inventory"
              style={{
                textDecoration: 'none',
                color: pathname === '/inventory' ? '#1976d2' : 'black'
              }}>
              <ListItem button key="Inventory">
                <ListItemIcon>
                  <InventoryIcon color={pathname === '/inventory' ? 'primary' : 'inherit'}/>
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </Link>
            <Link
              to="/users"
              style={{
                textDecoration: 'none',
                color: pathname === '/users' ? '#1976d2' : 'black'
              }}>
              <ListItem button key="Users">
                <ListItemIcon>
                  <PeopleIcon color={pathname === '/users' ? 'primary' : 'inherit'}/>
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="inventory" element={<Inventory />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </Box>
    </Box>
  );
}

