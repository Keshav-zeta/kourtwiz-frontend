import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const changeSelectedClub = async ({ clubId }: { clubId: string }) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  const response = await axios.put(
    `http://44.216.113.234:8080/users/change-active-club/${clubId}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateChangeActiveclub = ({
  onSuccessCallback,
  onErrorCallback,
}) => {
  return useMutation({
    mutationFn: changeSelectedClub,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.log('error: ', error);
      onErrorCallback?.(error);
    },
  });
};
