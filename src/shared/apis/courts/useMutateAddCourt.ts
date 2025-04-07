import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addCourt = async ({ clubId, courtData }) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://44.216.113.234:8080/courts/club/${clubId}`,
    courtData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );

  return response.data;
};

export const useMutateAddCourt = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourt,
    onSuccess: (data) => {
      onSuccessCallback?.(data);
      queryClient.invalidateQueries(['club-court']);
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
  });
};
