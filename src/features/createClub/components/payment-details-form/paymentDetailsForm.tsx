import { TextField, Grid, Typography } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ClubSchema } from '../../schema/clubSchema';

interface PaymentDetailsFormProps {
  register: UseFormRegister<ClubSchema>;
  errors: FieldErrors<ClubSchema>;
}

const PaymentDetailsForm = ({ register, errors }: PaymentDetailsFormProps) => {
  return (
    <>
      <Typography variant='h5' gutterBottom color='white'>
        payment Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Card Number'
            {...register('paymentDetails.cardNumber')}
            error={!!errors.paymentDetails?.cardNumber}
            helperText={errors.paymentDetails?.cardNumber?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='CVV'
            {...register('paymentDetails.cvv')}
            error={!!errors.paymentDetails?.cvv}
            helperText={errors.paymentDetails?.cvv?.message}
            variant='outlined'
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Expiry Date (MM/YY)'
            {...register('paymentDetails.expiryDate')}
            error={!!errors.paymentDetails?.expiryDate}
            helperText={errors.paymentDetails?.expiryDate?.message}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Cardholder Name'
            {...register('paymentDetails.cardHolderName')}
            error={!!errors.paymentDetails?.cardHolderName}
            helperText={errors.paymentDetails?.cardHolderName?.message}
            variant='outlined'
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Card Type (VISA/MASTERCARD/AMEX)'
            {...register('paymentDetails.cardTypeEnum')}
            error={!!errors.paymentDetails?.cardTypeEnum}
            helperText={errors.paymentDetails?.cardTypeEnum?.message}
            variant='outlined'
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentDetailsForm;
