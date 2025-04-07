import { TextField, Grid, Typography } from '@mui/material';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ClubSchema } from '../../schema/clubSchema';
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

interface BasicDetailsFormProps {
  register: UseFormRegister<ClubSchema>;
  errors: FieldErrors<ClubSchema>;
  watch: UseFormWatch<ClubSchema>;
  setValue: UseFormSetValue<ClubSchema>;
}

const BasicDetailsForm = ({ register, errors, watch, setValue }: BasicDetailsFormProps) => {
  return (
    <>
      <Typography variant='h6' gutterBottom color='white'>
        Basic Details
      </Typography>
      <Grid container spacing={2}>
        {/* Row 1 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Club Name'
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Logo URL'
            {...register('logoUrl')}
            error={!!errors.logoUrl}
            helperText={errors.logoUrl?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Banner URL'
            {...register('bannerUrl')}
            error={!!errors.bannerUrl}
            helperText={errors.bannerUrl?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Club Email'
            type='email'
            {...register('clubEmailId')}
            error={!!errors.clubEmailId}
            helperText={errors.clubEmailId?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 3 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Owner Name'
            {...register('clubOwnerName')}
            error={!!errors.clubOwnerName}
            helperText={errors.clubOwnerName?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 4 */}
        <Grid item xs={12} sm={6}>
        <PhoneInput
          international
          defaultCountry="US"
          countryCallingCodeEditable={false}
          error={!!errors.clubPhoneNumber}
          value={watch("clubPhoneNumber")}
          onChange={(value) => setValue("clubPhoneNumber", value)} 
          maxlength={15}
        />
      </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Address'
            {...register('clubAddress')}
            error={!!errors.clubAddress}
            helperText={errors.clubAddress?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 5 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='City'
            {...register('clubCity')}
            error={!!errors.clubCity}
            helperText={errors.clubCity?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='State'
            {...register('clubState')}
            error={!!errors.clubState}
            helperText={errors.clubState?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 6 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Country'
            {...register('clubCountry')}
            error={!!errors.clubCountry}
            helperText={errors.clubCountry?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Timezone'
            {...register('timezone')}
            error={!!errors.timezone}
            helperText={errors.timezone?.message}
            variant='outlined'
          />
        </Grid>

        {/* Row 7 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Website URL'
            {...register('websiteUrl')}
            error={!!errors.websiteUrl}
            helperText={errors.websiteUrl?.message}
            variant='outlined'
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BasicDetailsForm;
