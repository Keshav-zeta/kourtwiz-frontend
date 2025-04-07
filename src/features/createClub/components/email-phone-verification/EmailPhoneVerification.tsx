import { Button, TextField, Typography, Box, Grid2 } from '@mui/material';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { useSendOtpEmail } from '../../../../shared/apis/otp/useSendOtpEmail';
import { useEffect, useState } from 'react';
import { useValidateOtp } from '../../../../shared/apis/otp/useValidateOtp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSendOtpSms } from '../../../../shared/apis/otp/useSendOtpSms';
import { toast } from 'react-toastify';

interface OtpVerificationStatus {
  type: string;
  result: boolean;
}
//look into phone verification later
interface VerificationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<any>;
  handleOtpVerificationStatus: (status: OtpVerificationStatus) => void;
}
const EmailPhoneVerification: React.FC<VerificationProps> = ({
  register,
  errors,
  watch,
  handleOtpVerificationStatus,
}) => {
  const [enterEmailOtp, setEnterEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(120);

  const [enterPhoneOtp, setEnterPhoneOtp] = useState('');
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(120);

  useEffect(() => {
      let emailInterval, phoneInterval;
  
      if (isEmailOtpSent && emailTimer > 0) {
        emailInterval = setInterval(() => {
          setEmailTimer((prev) => prev - 1);
        }, 1000);
      } else if (emailTimer === 0) {
        setIsEmailOtpSent(false);
        setEmailTimer(120);
      }
  
      if (isPhoneOtpSent && phoneTimer > 0) {
        phoneInterval = setInterval(() => {
          setPhoneTimer((prev) => prev - 1);
        }, 1000);
      } else if (phoneTimer === 0) {
        setIsPhoneOtpSent(false);
        setPhoneTimer(120);
      }
  
      return () => {
        clearInterval(emailInterval);
        clearInterval(phoneInterval);
      };
    }, [isEmailOtpSent, emailTimer, setIsPhoneOtpSent, phoneTimer, isPhoneOtpSent]);

  const { mutate: mutateSendEmailOtp, status: emailOtpStatus } =
    useSendOtpEmail({
      onSuccessCallback: () => {
        setIsEmailOtpSent(true);
        setEmailTimer(120);
        console.log('otp sent');
        toast.success('OTP sent to your email');
      },
      onErrorCallback: () => {
        setIsEmailOtpSent(false);
        console.log('error while sending the otp');
        toast.error('Error while sending the OTP');
      },
    });
  const { mutate: mutateValidateOtp, status: validateOtpStatus } =
    useValidateOtp({
      onSuccessCallback: (type: string) => {
        console.log('otp validated! ', type);
        handleOtpVerificationStatus({ type, result: true });
        if (type === 'email') {
          setIsEmailVerified(true);
        } else {
          setIsPhoneVerified(true);
        }
      },
      onErrorCallback: (type: string) => {
        console.log('error while validating the otp', type);
        if (type === 'email') {
          setIsEmailVerified(false);
          handleOtpVerificationStatus({ type, result: false });
          toast.error('Error while validating the OTP');
        } else {
          setIsPhoneVerified(true);
          handleOtpVerificationStatus({ type, result: true });
        }
      },
    });

  const { mutate: mutateSendPhoneOtp } = useSendOtpSms({
    onSuccessCallback: () => {
      setIsPhoneOtpSent(true);
      setPhoneTimer(120);
      toast.success('OTP sent to your phone');
    },
    onErrorCallback: () => {
      setIsPhoneOtpSent(false);
      toast.error('Error while sending the OTP');
    },
  });
  const sendEmailOtp = () => {
    console.log('email ', watch('clubEmailId'));
    mutateSendEmailOtp({ email: watch('clubEmailId') });
  };
  const sendPhoneOtp = () => {
    console.log('sending phone otp', watch('clubPhoneNumber'));
    mutateSendPhoneOtp({ phone: watch('clubPhoneNumber') });
  };
  const handleValidateOtp = ({
    recipient,
    otp,
    type,
  }: {
    recipient: string;
    otp: string;
    type: string;
  }) => {
    mutateValidateOtp({ recipient: recipient, otp: otp, type: type });
  };
  return (
    <Box display='flex' flexDirection='column' gap={3} alignItems='center'>
      <Typography variant='h6' gutterBottom color='white'>
        Verify Email
      </Typography>
      <Grid2 container spacing={2} alignItems='center'>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            {...register('clubEmailId')}
            value={watch('clubEmailId')}
            disabled
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => sendEmailOtp()}
            disabled={isEmailOtpSent}
            loading={emailOtpStatus == 'pending'}
          >
            {isEmailOtpSent
                  ? `Resend in ${Math.floor(emailTimer / 60)}:${String(
                      emailTimer % 60
                    ).padStart(2, "0")}`
                  : "Send OTP"}
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isEmailOtpSent && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} alignItems={'center'}>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            value={enterEmailOtp}
            onChange={(e) => {
              setEnterEmailOtp(e.target.value);
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => {
              handleValidateOtp({
                recipient: watch('clubEmailId'),
                otp: enterEmailOtp,
                type: 'email',
              });
            }}
            loading={validateOtpStatus === 'pending'}
          >
            Verify
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isEmailVerified && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
      <Typography variant='h6' color='white' gutterBottom>
        Verify Phone
      </Typography>
      {/* Phone Verification */}
      <Grid2 container spacing={2} alignItems='center'>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            {...register('clubPhoneNumber')}
            value={watch('clubPhoneNumber')}
            disabled
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              sendPhoneOtp();
            }}
            disabled={isPhoneOtpSent}
            fullWidth
            sx={{ mt: 1 }}
          >
            {isPhoneOtpSent
              ? `Resend in ${Math.floor(phoneTimer / 60)}:${String(
                  phoneTimer % 60
                ).padStart(2, '0')}`
              : 'Send OTP'}
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isPhoneOtpSent && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2} alignItems={'center'}>
        <Grid2 size={{ xs: 12, sm: 6 }} item>
          <TextField
            value={enterPhoneOtp}
            onChange={(e) => {
              setEnterPhoneOtp(e.target.value);
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 3 }} item>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 1 }}
            onClick={() => {
              handleValidateOtp({
                recipient: watch('clubPhoneNumber'),
                otp: enterPhoneOtp,
                type: 'phone',
              });
            }}
          >
            Verify
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 'auto' }} item>
          {isPhoneVerified && <CheckCircleIcon color='success' />}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default EmailPhoneVerification;
