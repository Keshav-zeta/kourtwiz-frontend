import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const validateOtp = async ({
  recipient,
  otp,
  type,
}: {
  recipient: string;
  otp: string;
  type: string;
}) => {
  if (!recipient || !otp) {
    throw new Error('Recipient and OTP are required');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/temp-otp/validate?recipient=${encodeURIComponent(
      recipient
    )}&otp=${encodeURIComponent(otp)}`,
    {},
    {
      headers: {
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useValidateOtp = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: validateOtp,
    onSuccess: (data, variables) => {
      onSuccessCallback?.(variables.type);
    },
    onError: (error, variables) => {
      onErrorCallback?.(variables.type);
    },
  });
};
