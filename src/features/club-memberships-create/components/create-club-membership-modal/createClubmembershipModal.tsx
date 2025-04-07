import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import './createClubMembershipModal.css';
import { useContext } from 'react';
import AuthContext from '../../../../context/AuthContext';
import { useMutateCreateClubMembership } from '../../../../shared/apis/memberships/useMutateCreateClubMembership';
import { toast } from 'react-toastify';

const PERKS_OPTIONS = [
  'advanceBookingDays',
  'openPlaySessionsAllowed',
  'tournamentAccess',
  'guestPasses',
  'coachingSessions',
];

const CreateClubMembershipModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      durationInDays: '',
      selectedPerks: [],
      perks: {},
      isFamilyPlan: false,
      maxFamilyMembers: '',
      guestPasses: '',
      discountPercentage: '',
      autoRenewalAllowed: false,
      upgradableTo: [],
      customPerks: [],
    },
  });

  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;

  const { mutate: createMembership, isLoading } = useMutateCreateClubMembership({
    clubId,
    onSuccessCallback: () => {
      toast.success('Membership created successfully!');
      onClose();
      reset();
    },
    onErrorCallback: (err) => {
      console.error('Membership creation error:', err);
      toast.error('Failed to create membership.');
    },
  });
  const PERKS_LABELS: Record<string, string> = {
    advanceBookingDays: 'Advance Booking (Days)',
    openPlaySessionsAllowed: 'Open Play Sessions Allowed',
    tournamentAccess: 'Tournament Entries',
    guestPasses: 'Guest Passes',
    coachingSessions: 'Coaching Sessions',
  };
  const PERKS_OPTIONS = Object.keys(PERKS_LABELS);

  const selectedPerks = watch('selectedPerks');
  const { fields: customPerksFields, append, remove } = useFieldArray({
    control,
    name: 'customPerks',
  });

  const handleFormSubmit = (data) => {
    const perksPayload = {};
    PERKS_OPTIONS.forEach((perk) => {
      const value = data.perks?.[perk];
      perksPayload[perk] = value ? Number(value) : 0;
    });

    const formattedPayload = {
      clubId,
      membershipName: data.name,
      duration: Number(data.durationInDays),
      price: parseFloat(Number(data.price).toFixed(1)),
      perks: perksPayload,
      customPerks: data.customPerks.map((perk) => ({
        name: perk.name,
        value: Number(perk.value),
      })),
    };

    createMembership(formattedPayload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container">
        <Typography className="modal-title">Create Membership</Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="modal-form">
          <TextField label="Name" {...register('name')} className="full-width" />
          <TextField
            label="Price"
            type="number"
            inputProps={{ step: '0.01' }}
            {...register('price')}
          />
          <TextField
            label="Duration (Months)"
            type="number"
            {...register('durationInDays')}
          />

          <FormControl className="full-width">
            <InputLabel>Perks</InputLabel>
            <Controller
              control={control}
              name="selectedPerks"
              render={({ field }) => (
                <Select multiple {...field}>
                  {PERKS_OPTIONS.map((perk) => (
                    <MenuItem key={perk} value={perk}>
                      {PERKS_LABELS[perk]}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {selectedPerks.map((perk) => (
            <Box key={perk} mb={2} display="grid" gap={2}>
              <Typography sx={{ width: '50%' }}>{perk}</Typography>
              <TextField
                label="Value"
                type="number"
                {...register(`perks.${perk}`)}
                sx={{ width: '50%' }}
              />
            </Box>
          ))}

          {customPerksFields.map((item, index) => (
            <Grid container spacing={2} key={item.id} className="perk-row">
              <Grid item xs={5}>
                <TextField
                  label="Name"
                  {...register(`customPerks.${index}.name`)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Value"
                  {...register(`customPerks.${index}.value`)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Button color="error" className="remove-button" onClick={() => remove(index)}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            onClick={() => append({ name: '', value: '' })}
            className="add-custom-perk-btn"
          >
            Add Custom Perk
          </Button>

          <div className="button-group-create-membership full-width">
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateClubMembershipModal;
