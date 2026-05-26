import { createTheme } from '@mui/material/styles';

export const tokens = {
  colors: {
    bgMain: '#F5F7FA',
    sidebarBg: '#00A7D2',
    sidebarActive: '#012b44ff',
    sidebarBtn: '#026198',
    statusPending: '#FFB000',
    statusReviewed: '#34A853',
    textWhite: '#FFFFFF',
    textDark: '#1E293B',
    textMuted: '#64748B',
    cardBg: '#FFFFFF',
    cardPreviewBg: '#EAECEE',
    border: '#E2E8F0',
  },
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  }
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.sidebarBg,
      dark: tokens.colors.sidebarActive,
      contrastText: tokens.colors.textWhite,
    },
    secondary: {
      main: tokens.colors.sidebarBtn,
      contrastText: tokens.colors.textWhite,
    },
    background: {
      default: tokens.colors.bgMain,
      paper: tokens.colors.cardBg,
    },
    text: {
      primary: tokens.colors.textDark,
      secondary: tokens.colors.textMuted,
    },
    success: {
      main: tokens.colors.statusReviewed,
    },
    warning: {
      main: tokens.colors.statusPending,
    },
    divider: tokens.colors.border,
  },
  typography: {
    fontFamily: tokens.fontFamily,
    h1: {
      fontWeight: 700,
      fontSize: '28px',
      color: tokens.colors.textDark,
    },
    h2: {
      fontWeight: 600,
      fontSize: '22px',
      color: tokens.colors.textDark,
    },
    body1: {
      color: tokens.colors.textDark,
    },
  },
  shape: {
    borderRadius: tokens.radius.md,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
