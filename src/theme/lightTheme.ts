import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#5f6368',
    },
    divider: '#e0e0e0',
    error: {
      main: '#d32f2f',
    },
    info: {
      main: '#0288d1',
    },
  },
});

export default lightTheme;
