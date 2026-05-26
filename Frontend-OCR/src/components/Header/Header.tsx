import React from 'react';
import logoImg from '../../assets/LogoSmall.png';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <Box 
      component="header"
      sx={{
        height: 70,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        boxSizing: 'border-box',
        width: '100%',
        flexShrink: 0
      }}
    >
      {/* left side - logo of Modulo Sanitario */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {onMenuToggle && (
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ 
              display: { md: 'none' }, 
              color: 'text.primary',
              mr: 1.5,
              padding: '6px'
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box 
          component="img"
          src={logoImg} 
          alt="Modulo Sanitario Logo" 
          sx={{
            height: 38,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </Box>

      {/* right side - user name + avatar */}
      {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'var(--font-family)',
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Pedro Lopez
        </Typography>
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            bgcolor: 'primary.main', 
            fontSize: '13px', 
            fontWeight: 700,
            color: tokens.colors.textWhite,
            boxShadow: '0 0 0 2px #FFF, 0 0 0 4px rgba(0, 167, 210, 0.2)'
          }}
        >
          PL
        </Avatar>
      </Box> */}
    </Box>
  );
};
