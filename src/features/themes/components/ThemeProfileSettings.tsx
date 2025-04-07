import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useThemeMode } from '../../../context/ThemeContext';

const defaultNewTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#000000', secondary: '#5f5f5f' },
    error: { main: '#f44336' },
    info: { main: '#2196f3' },
  },
};

const ThemeProfileSettings = () => {
  const { setTheme, addCustomTheme, customThemes } = useThemeMode();
  console.log('customThemes : ', customThemes);
  const [open, setOpen] = useState(false);
  const [newTheme, setNewTheme] = useState(defaultNewTheme);
  const [name, setName] = useState('');
  console.log(newTheme);
  const handleInputChange = (path, value) => {
    console.log(path, value);
    const keys = path.split('.');
    const updatedTheme = { ...newTheme };
    let current = updatedTheme;
    while (keys.length > 1) {
      const key = keys.shift();
      console.log('key : ', key);
      current[key] = { ...current[key] };
      current = current[key];
    }
    current[keys[0]] = value;
    setNewTheme(updatedTheme);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    addCustomTheme(name.trim(), newTheme);
    setOpen(false);
    setName('');
    setNewTheme(defaultNewTheme);
  };

  return (
    <Box p={4}>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item>
          <Card
            sx={{ width: 120, height: 120, cursor: 'pointer', bgcolor: '#fff' }}
            onClick={() => setTheme('light')}
          >
            <CardContent>
              <Typography variant='body1' align='center'>
                Light Theme
              </Typography>
              <Typography variant='caption' align='center' display='block'>
                Click to Apply
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#121212',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => setTheme('dark')}
          >
            <CardContent>
              <Typography variant='body1' align='center'>
                Dark Theme
              </Typography>
              <Typography variant='caption' align='center' display='block'>
                Click to Apply
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {customThemes.map((theme: any) => (
          <Grid item key={theme.name}>
            <Card
              sx={{
                width: 120,
                height: 120,
                cursor: 'pointer',
                bgcolor: theme.theme.palette.primary.main,
              }}
              onClick={() => setTheme(theme.name)}
            >
              <CardContent>
                <Typography
                  variant='body1'
                  align='center'
                  sx={{ color: theme.theme.palette.text.primary }}
                >
                  {theme.name}
                </Typography>
                <Typography
                  variant='caption'
                  align='center'
                  display='block'
                  sx={{ color: theme.theme.palette.text.secondary }}
                >
                  Click to Apply
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item>
          <Card
            sx={{
              width: 120,
              height: 120,
              cursor: 'pointer',
              bgcolor: '#808080',
            }}
            onClick={() => setOpen(true)}
          >
            <CardContent>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                height='100%'
              >
                <AddIcon />
                <Typography variant='caption'>Add Theme</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            mx: 'auto',
            mt: '10%',
          }}
        >
          <Typography variant='h6'>Create Custom Theme</Typography>
          <TextField
            label='Theme Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          {Object.entries(newTheme.palette).map(([sectionKey, sectionVal]) => {
            if (typeof sectionVal === 'object') {
              return Object.entries(sectionVal).map(([colorKey, colorVal]) => {
                const fullKey = `palette.${sectionKey}.${colorKey}`;
                return (
                  <TextField
                    key={fullKey}
                    label={`${sectionKey}.${colorKey}`}
                    type='color'
                    fullWidth
                    sx={{ mt: 2 }}
                    value={colorVal}
                    onChange={(e) => handleInputChange(fullKey, e.target.value)}
                  />
                );
              });
            }

            return null;
          })}

          <Box mt={3} display='flex' justifyContent='space-between'>
            <Button variant='outlined' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ThemeProfileSettings;
