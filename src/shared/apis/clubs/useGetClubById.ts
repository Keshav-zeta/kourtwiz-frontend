import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchClubById = async (clubId: string) => {
  const token = localStorage.getItem('jwtToken');
  if (!clubId) {
    throw new Error('Club ID is required');
  }
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(
      `http://44.216.113.234:8080/clubs/id/${clubId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching club by ID:', error);
    throw error; // rethrow so react-query knows there was an error
  }
};

export const useGetClubById = (clubId: string) => {
  return useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubById(clubId),
    enabled: !!clubId, // Ensures the query runs only when clubId is provided
  });
};
