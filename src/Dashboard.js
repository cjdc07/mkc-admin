import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import InventoryIcon from '@mui/icons-material/Inventory';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { UserContext } from './contexts/UserContext';
import { USER_ROLES } from './constants';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

export default function Dashboard() {
  const { pathname } = useLocation();
  const { user, setUser } = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  if (!user) {
    return <Navigate to="/login" />
  }

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setAnchorEl(null);
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Typography variant="h6" noWrap component="div">
            MKC Admin
          </Typography>
          <Box>
            <Box onClick={(e) => setAnchorEl(e.currentTarget)}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              {user.username}
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={logout}><LogoutIcon />&nbsp;Logout</MenuItem>
            </Menu>
          </Box>
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
            {user.role === USER_ROLES.OWNER && (
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
            )}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

