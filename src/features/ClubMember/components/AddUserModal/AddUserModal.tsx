import { useForm } from 'react-hook-form';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useMutateAddUser } from '../../../../shared/apis/User/useMutateAddUser';
import { toast } from 'react-toastify';
import './AddUserModal.css';
import { useMutateAssignRoleUser } from '../../../../shared/apis/User/useMutateAssignRole';

const AddUserModal = ({
  open,
  onClose,
  currentClubId,
  clubName,
}: {
  open: boolean;
  onClose: () => void;
  currentClubId: string;
  clubName: string;
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      phoneNumber: '',
      profilePictureUrl: '',
      dateOfBirth: '',
      currentActiveClubId: currentClubId,
      skillLevel: '',
      preferredTime: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  const handleAddMembership = (data: any) => {
    assignMemberMutate({
      userEmail: data.email,
      clubName: clubName,
      roleName: 'Member',
    });
  };
  const { mutate: addUserMutate } = useMutateAddUser({
    onSuccessCallback: (data) => {
      toast.success('User added successfully!');
      handleAddMembership(data);
    },
    onErrorCallback: () => {
      toast.error('Failed to add user!');
    },
  });
  const { mutate: assignMemberMutate } = useMutateAssignRoleUser({
    onSuccessCallback: () => {
      toast.success('Member assigned!');
      onClose();
    },
    onErrorCallback: () => {
      toast.error('Failed to assign member');
      onClose();
    },
  });
  const onSubmit = (data: any) => {
    addUserMutate(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='add-user-modal-container'>
        <Typography className='add-user-modal-title'>Create User</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className='add-user-modal-form'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Email'
                {...register('email')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Name'
                {...register('name')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Password'
                type='password'
                {...register('password')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Phone Number'
                {...register('phoneNumber')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Profile Picture URL'
                {...register('profilePictureUrl')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Date of Birth'
                type='date'
                {...register('dateOfBirth')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label='Skill Level'
                {...register('skillLevel')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Preferred Time'
                {...register('preferredTime')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Gender' {...register('gender')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Address' {...register('address')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='City' {...register('city')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='State' {...register('state')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Country' {...register('country')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Zip Code' {...register('zipCode')} fullWidth />
            </Grid>
          </Grid>

          <div className='add-user-button-group'>
            <Button onClick={onClose} variant='outlined'>
              Cancel
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
