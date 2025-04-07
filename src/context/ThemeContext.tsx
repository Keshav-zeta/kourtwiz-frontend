// context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import lightTheme from '../theme/lightTheme';
import darkTheme from '../theme/darkTheme';
import AuthContext from './AuthContext';

const ThemeModeContext = createContext(null);

// Storage helpers
const getStorageItem = (key, fallback = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const ThemeContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext)!;
  const [mode, setMode] = useState('light');
  const [customThemes, setCustomThemes] = useState([]);
  console.log('theme mode : ', mode);
  console.log('custom themes : ', customThemes);

  const userId = user?.userId;
  const clubId = user?.currentActiveClubId;

  // Load theme mode and custom themes
  useEffect(() => {
    console.log('load start');
    if (!userId || !clubId) return;

    const modesByUser = getStorageItem('themeModeByUser');
    const themesByUser = getStorageItem('customThemesByUser');

    const userModes = modesByUser[userId] || {};
    const userThemes = themesByUser[userId] || {};

    const themeMode = userModes[clubId] || 'light';
    const clubThemes = userThemes[clubId] || [];

    setMode(themeMode);
    setCustomThemes(clubThemes);
    console.log('load end');
  }, [userId, clubId]);

  // Save theme mode when it changes
  useEffect(() => {
    console.log('save start mode');

    if (!userId || !clubId) return;
    console.log('save start mode 1');

    const modesByUser = getStorageItem('themeModeByUser');
    console.log('save start mode 2', modesByUser);

    if (!modesByUser[userId]) {
      modesByUser[userId] = {};
    }
    console.log('save start mode 3', modesByUser);

    modesByUser[userId][clubId] = mode;
    console.log('save start mode 4');

    setStorageItem('themeModeByUser', modesByUser);
    console.log('save end mode');
  }, [mode, userId, clubId]);

  // Save custom themes when they change
  useEffect(() => {
    console.log('save themes start');

    if (!userId || !clubId) return;

    const themesByUser = getStorageItem('customThemesByUser');
    if (!themesByUser[userId]) {
      themesByUser[userId] = {};
    }

    themesByUser[userId][clubId] = customThemes;
    setStorageItem('customThemesByUser', themesByUser);
    console.log('save themes end');
  }, [customThemes, userId, clubId]);

  const currentTheme = useMemo(() => {
    console.log('creating themes');
    if (!userId || !clubId) return createTheme(lightTheme);
    if (mode === 'light') return createTheme(lightTheme);
    if (mode === 'dark') return createTheme(darkTheme);

    const custom = customThemes.find((t) => t.name === mode);
    return custom ? createTheme(custom.theme) : createTheme(lightTheme);
  }, [mode, customThemes]);

  const addCustomTheme = (name, theme) => {
    console.log('adding custom theme : ');
    setCustomThemes((prev) => [...prev, { name, theme }]);
    setMode(name);
  };

  return (
    <ThemeModeContext.Provider
      value={{ mode, setTheme: setMode, addCustomTheme, customThemes }}
    >
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
