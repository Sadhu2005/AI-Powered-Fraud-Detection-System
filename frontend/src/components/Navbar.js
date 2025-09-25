import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Security,
  Menu as MenuIcon,
  Dashboard,
  QrCodeScanner,
  Link,
  AccountBalance,
  Web,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: <Security /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/sms', label: 'SMS Scanner', icon: <QrCodeScanner /> },
    { path: '/url', label: 'URL Scanner', icon: <Link /> },
    { path: '/transaction', label: 'Transaction Monitor', icon: <AccountBalance /> },
    { path: '/website', label: 'Website Scanner', icon: <Web /> },
    { path: '/blockchain', label: 'Blockchain Viewer', icon: <Security /> },
  ];

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
          SafeGuard AI
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              {item.icon}
              <Typography sx={{ ml: 1 }}>{item.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
