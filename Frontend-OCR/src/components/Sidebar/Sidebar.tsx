import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

interface SidebarProps {
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const menuItems = [
    { path: '/encuestas', label: 'Encuestas', icon: <DescriptionIcon /> },
    { path: '/familias', label: 'Familias', icon: <PeopleIcon /> },
    { path: '/reportes', label: 'Reportes', icon: <BarChartIcon /> },
    { path: '/configuracion', label: 'Configuracion', icon: <SettingsIcon /> },
  ];

  return (
    <Box 
      component="aside"
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: 'primary.main',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3,
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      {/* Navigation menu */}
      <List disablePadding sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={onLinkClick}
              sx={{
                borderRadius: 1,
                color: 'rgba(255, 255, 255, 0.8)',
                px: 2,
                py: 1.25,
                bgcolor: 'secondary.main',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  color: '#FFF',
                  '& .MuiListItemIcon-root': {
                    color: '#FFF',
                  }
                },
                '&.active': {
                  bgcolor: 'primary.dark',
                  color: '#FFF',
                  boxShadow: 1,
                  '& .MuiListItemIcon-root': {
                    color: '#FFF',
                  }
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    sx={{ 
                      color: '#FFF',
                      fontWeight: 600, 
                      fontSize: '15px', 
                      letterSpacing: '0.3px'
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User profile */}
      {/* <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.25, 
          bgcolor: 'secondary.main', 
          borderRadius: 'var(--radius-md)', 
          p: 1.5,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            bgcolor: 'primary.main', 
            fontSize: '13px', 
            fontWeight: 700,
            color: '#FFF',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)'
          }}
        >
          PL
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#FFF', 
              fontWeight: 600, 
              fontSize: '13px', 
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            Pedro Lopez
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontWeight: 500, 
              fontSize: '10px', 
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              mt: 0.25
            }}
          >
            Coordinador
          </Typography>
        </Box>
        <IconButton 
          aria-label="Logout" 
          size="small" 
          sx={{ 
            color: '#FFF', 
            padding: '6px',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } 
          }}
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box> */}
    </Box>
  );
};
