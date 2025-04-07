import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubs = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get('http://44.216.113.234:8080/clubs', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error; // rethrow so react-query knows there was an error
  }
};

export const useGetClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: fetchClubs,
  });
};
