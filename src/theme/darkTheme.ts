import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#903a3a',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#5f6368',
    },
    divider: '#444',
    error: {
      main: '#f44336',
    },
    info: {
      main: '#29b6f6',
    },
  },
});

export default darkTheme;
