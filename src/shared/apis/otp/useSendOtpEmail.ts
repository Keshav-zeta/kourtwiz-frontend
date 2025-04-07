import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const sendOtpEmail = async ({ email }) => {
  console.log('email otp : ', email);
  if (!email) {
    throw new Error('Email is required');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/temp-otp/send-email?email=${encodeURIComponent(
      email
    )}`,
    {},
    {
      headers: {
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useSendOtpEmail = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: sendOtpEmail,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.log('error : ', error);
      onErrorCallback?.(error);
    },
  });
};
