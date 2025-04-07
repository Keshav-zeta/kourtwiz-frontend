import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const approveUser = async (userId: string) => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(
    `http://44.216.113.234:8080/temp-users/${userId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateApproveMember = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      onSuccessCallback();
    },
    onError: () => {
      onErrorCallback();
    },
  });
};
