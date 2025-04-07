import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  clubSchema,
  ClubSchema,
} from '../../features/createClub/schema/clubSchema';
import { toast } from 'react-toastify';
import { Button, Box, Typography, Divider } from '@mui/material';
import TestimonialCard from '../../features/createClub/components/testimonial-card/TestimonialCard';
import BasicDetailsForm from '../../features/createClub/components/basic-details-form/BasicDetailsForm';
import PaymentDetailsForm from '../../features/createClub/components/payment-details-form/paymentDetailsForm';
import './CreateClub.css';
import EmailPhoneVerification from '../../features/createClub/components/email-phone-verification/EmailPhoneVerification';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutateCreateClub } from '../../shared/apis/clubs/useMutateCreateClub';

const CreateClub = () => {
  const location = useLocation();
  const membershipId = location.state?.membershipId;
  const navigate = useNavigate();
  console.log('membership ID: ', membershipId);
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(clubSchema), mode: "onChange", });
  const { mutate: mutateCreateClub } = useMutateCreateClub({
    onSuccessCallback: () => {
      toast.success('Account created! Check your email for login credentials.');
      navigate('/home');
    },
    onErrorCallback: () => {
      toast.error('error while creating the account');
    },
  });
  const [verifyOtp, setVerifyOtp] = useState({ email: false, phone: false });
  const handleOtpVerificationStatus = ({
    type,
    result,
  }: {
    type: string;
    result: boolean;
  }) => {
    setVerifyOtp((prevOtp) => ({
      ...prevOtp,
      [type]: result,
    }));
  };

  const onSubmit = async (data: ClubSchema) => {
    mutateCreateClub({ clubData: data, planId: membershipId });
  };

  return (
    <div className='create-club-container'>
      <Box className='create-club-content'>
        <Typography variant='h5' gutterBottom color='white'>
          Join our network of Pickleball Clubs
        </Typography>
        <Divider className='createclub-divider' />
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <BasicDetailsForm register={register} errors={errors} watch={watch} setValue={setValue} />
          )}
          {step === 2 && (
            <EmailPhoneVerification
              register={register}
              errors={errors}
              watch={watch}
              handleOtpVerificationStatus={handleOtpVerificationStatus}
            />
          )}
          {step === 3 && (
            <PaymentDetailsForm register={register} errors={errors} />
          )}
          <div className='form-navigation'>
            <Button
              variant='contained'
              className='prev-button'
              onClick={() => setStep(step - 1)}
              disabled={step <= 1}
            >
              Prev
            </Button>

            {step < 3 && (
              <Button
                variant='contained'
                className='next-button'
                onClick={() => setStep(step + 1)}
                disabled={step >= 3}
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                type='submit'
                variant='contained'
                className='submit-button'
                onClick={() => onSubmit}
                // disabled={!verifyOtp.email || !verifyOtp.phone}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Box>
      <div className='testimonials-container'>
        <Typography variant='h6' gutterBottom>
          What Our Users Say
        </Typography>
        <div className='testimonials-grid'>
          <TestimonialCard
            stars={5}
            review='Amazing platform!'
            avatar='/images/menavatar.png'
            name='John Smith'
          />
          <TestimonialCard
            stars={4}
            review='Great features!'
            avatar='/images/femaleavatar.png'
            name='Emily Johnson'
          />
          <TestimonialCard
            stars={3}
            review='Good experience!'
            avatar='/images/menavatar.png'
            name='Michael Lee'
          />
        </div>
      </div>
    </div>
  );
};

export default CreateClub;
