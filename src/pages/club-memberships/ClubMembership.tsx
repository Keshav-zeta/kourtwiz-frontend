import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetClubPlans } from '../../shared/apis/clubs/useGetClubPlans';
import backgroundImage from '@/assets/pickleball2.jpg';
const styles = {
  background: `url(${backgroundImage}) center/cover no-repeat fixed`,
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const ClubMembershipPage = () => {
  const { data, isLoading } = useGetClubPlans();
  const navigate = useNavigate();

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box style={styles}>
      <Container>
        <Typography variant='h3' align='center' gutterBottom color='white'>
          Choose memberShip Plan For Club
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          {data?.map((plan) => (
            <Card
              key={plan.id}
              sx={{ width: 340, textAlign: 'center', p: 2, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant='h6'>{plan.name}</Typography>
                <Typography variant='h5' color='primary'>
                  ${plan.price} / {plan.billingCycle}
                </Typography>
                <Typography>Max Courts: {plan.maxCourts}</Typography>
                <Typography>Guest Check-ins: {plan.guestCheckIns}</Typography>
                <Typography>
                  Priority Booking: {plan.priorityBooking ? 'Yes' : 'No'}
                </Typography>
                <Typography>Support Level: {plan.supportLevel}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    navigate('/createClub', {
                      state: { membershipId: plan.id },
                    })
                  }
                >
                  SELECT
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ClubMembershipPage;
