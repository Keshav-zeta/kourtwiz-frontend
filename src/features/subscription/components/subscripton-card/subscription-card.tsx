import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  InputLabel,
  Select,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';

const SubscriptionCard = ({
  role,
  handlePayment,
  organizationsData,
}): JSX.Element => {
  const [orgName, setOrgName] = useState('');
  const handleSelect = (orgName) => {
    setOrgName(orgName);
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={role.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant='h5' gutterBottom>
            {role?.name}
          </Typography>

          <Typography variant='h6' color='primary' gutterBottom>
            {'100 $'}
          </Typography>

          <Box component='ul' sx={{ pl: 2 }}>
            {role.tasks.map((task, idx) => (
              <li key={idx}>
                <Typography variant='h6'>{task.taskName}</Typography>
              </li>
            ))}
          </Box>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mt: 2,
            mb: 2,
          }}
        >
          <InputLabel htmlFor='organization-select'>
            Select Organization
          </InputLabel>
          <Select
            native
            value={orgName}
            onChange={(e) => handleSelect(e.target.value)}
            inputProps={{
              name: 'organization',
              id: 'organization-select',
            }}
            sx={{ mt: 1, width: '100%' }} // full width if you want it to look aligned and consistent
          >
            <option value='' disabled>
              -- Select an organization --
            </option>
            {organizationsData?.map((orgData) => (
              <option key={orgData.name} value={orgData.name}>
                {orgData.name}
              </option>
            ))}
          </Select>
        </Box>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => {
              handlePayment(role, orgName);
            }}
          >
            Pay Now
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default SubscriptionCard;
