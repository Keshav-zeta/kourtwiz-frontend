import axios from 'axios';

export const fetchCourts = async (clubId: string) => {
  if (!clubId) throw new Error('Club ID is required');

  const token = localStorage.getItem('jwtToken');
  const response = await axios.get(`http://44.216.113.234:8080/courts/club/${clubId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.map((court: any) => ({ id: court.id, title: court.name }));
};
