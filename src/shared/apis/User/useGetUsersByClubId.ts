import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'http://44.216.113.234:8080'; // Move to an env file if needed

const getUsersByClubId = async (clubId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/user-club-roles/club/${clubId}`,
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Store token securely
      },
    }
  );
  return response.data;
};

export const useGetUsersByClubId = (clubId: string) => {
  return useQuery({
    queryKey: ['usersByClubId', clubId],
    queryFn: () => getUsersByClubId(clubId),
    enabled: !!clubId,
  });
};
