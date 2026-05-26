import React, { useState } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { Outlet } from 'react-router-dom';
import { Drawer, Box } from '@mui/material';

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        bgcolor: 'background.default',
        m: 0,
        p: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Desktop Sidebar (hidden on mobile) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar />
      </Box>

      {/* Mobile Drawer Sidebar (hidden on desktop) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            border: 'none',
          },
        }}
      >
        <Sidebar onLinkClick={() => setMobileOpen(false)} />
      </Drawer>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          height: '100%', 
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Header onMenuToggle={handleDrawerToggle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 4, 
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
