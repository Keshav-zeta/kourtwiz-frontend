import { Box, Grid, Typography, Button, Modal, Chip } from '@mui/material';
import SubscriptionCard from '../features/subscription/components/subscripton-card/subscription-card';
import { useRef, useState } from 'react';
import { useGetRoles } from '../features/subscription/api/useGetRoles';
import { useMutateAssignRole } from '../features/subscription/api/useMutateAssignRole';
import { useGetUserDetails } from '../features/subscription/api/useGetUserDetails';
import { useGetOrganizations } from '../features/subscription/api/useGetOrganization';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SubscriptionPage = () => {
  const { data: roles, isLoading } = useGetRoles();
  const { mutate } = useMutateAssignRole({
    onSuccessCallback: () => {
      toast.success('role assigned successfully!');

      handleClose();
    },
    onErrorCallback: () => {
      toast.error('error while assing role');
      handleClose();
    },
  });
  const { data: userDetails, isLoading: loadingUserDetails } =
    useGetUserDetails();
  const { data: organizationData, isLoading: loadingOrg } =
    useGetOrganizations();
  const assignRoleData = useRef({});
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handlePayment = (role, orgName) => {
    handleOpen();
    assignRoleData.current = {
      userEmail: userDetails.email,
      organizationName: orgName,
      roleName: role.name,
    };
  };

  const [openMoal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  if (isLoading || loadingUserDetails || loadingOrg) {
    return 'loading...';
  }
  return (
    <Box sx={{ p: 4 }}>
      <Modal
        keepMounted
        open={openMoal}
        onClose={handleClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={style}>
          <Typography id='keep-mounted-modal-title' variant='h6' component='h2'>
            Make Payment
          </Typography>
          <Button
            onClick={() => {
              mutate(assignRoleData.current);
              handleClose();
            }}
          >
            Proceed
          </Button>
        </Box>
      </Modal>
      <Typography variant='h4' align='center' gutterBottom>
        Choose Your Subscription
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        {roles &&
          roles.map((role) => {
            if (role.name === 'MasterAdmin') return null;
            return (
              <SubscriptionCard
                key={role.id} // Always add a key inside map!
                role={role}
                handlePayment={handlePayment}
                organizationsData={organizationData}
              />
            );
          })}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          mt: 3,
        }}
      >
        <Typography
          variant='h6'
          sx={{
            whiteSpace: 'nowrap',
            mr: 2,
            minWidth: '100px',
          }}
        >
          Your Roles:
        </Typography>

        {userDetails.roles.length == 0 ? (
          <Typography variant='h6'>You do not have any role</Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {userDetails.roles.map((role) => (
              <Chip
                key={role.name}
                label={role.name}
                color='primary'
                variant='outlined'
                sx={{ fontSize: '0.875rem' }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
