import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubPlans = async () => {
  try {
    const response = await axios.get('http://44.216.113.234:8080/club/plans', {
      headers: {
        Accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching club plans:', error);
    throw error; // rethrow so react-query knows there was an error
  }
};

export const useGetClubPlans = () => {
  return useQuery({
    queryKey: ['club-plans'],
    queryFn: fetchClubPlans,
  });
};
