import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ThemeProfileSettings from '../../features/themes/components/ThemeProfileSettings';

const ThemesSettings = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Page Title */}
      <Typography variant='h5' gutterBottom fontWeight='bold'>
        Club Branding & Customization
      </Typography>

      {/* Upload Section */}
      <Grid container spacing={3} mb={4}>
        {/* Club Logo Upload */}
        <Grid item xs={12} md={6}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                <img src='/src/assets/adminLogo.jpg' height='400' alt='Logo' />{' '}
                Club Logo
              </Typography>
              <Typography variant='body2' mb={2}>
                Upload your club logo. Recommended size: 512×512px, PNG or JPG
                format.
              </Typography>
              <Button variant='contained' startIcon={<UploadFileIcon />}>
                Upload Logo
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Club Banner Upload */}
        <Grid item xs={12} md={6}>
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                <img
                  src='/src/assets/clubBannerLogo.jpg'
                  height='400'
                  alt='Logo'
                />{' '}
                Club Banner
              </Typography>
              <Typography variant='body2' mb={2}>
                Upload a banner image for your club page. Recommended size:
                1200×300px.
              </Typography>
              <Button variant='contained' startIcon={<UploadFileIcon />}>
                Upload Banner
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Club Information Section */}
      <Typography variant='h6' gutterBottom fontWeight='bold'>
        Club Information
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          label='Club Name'
          variant='outlined'
          defaultValue='Riverside Pickleball Club'
        />
      </Box>

      <Box>
        <TextField
          fullWidth
          label='Club Description'
          variant='outlined'
          multiline
          rows={4}
          defaultValue='A community of pickleball enthusiasts dedicated to promoting the sport and fostering competitive play in a friendly environment.'
        />
      </Box>
      <Box>
        <Typography variant='h4' color='text.secondary'>
          Themes Settings
        </Typography>
        <ThemeProfileSettings />
      </Box>
    </Box>
  );
  // return (
  //   <>
  //     <Typography variant='h3' color='text.secondary'>
  //       Themes Settings
  //     </Typography>
  //     <ThemeProfileSettings />
  //   </>
  // );
};

export default ThemesSettings;
