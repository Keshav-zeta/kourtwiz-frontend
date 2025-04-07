import axios from 'axios';

export const fetchCoaches = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const response = await axios.get(`http://44.216.113.234:8080/api/clubs/${clubId}/coaches`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
