import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetPreviousBookings(userId: string): UseQueryResult<unknown, Error> {
  const getPreviousBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://44.216.113.234:8080/api/bookings/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch previous bookings');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return useQuery<unknown, Error>({
    queryKey: ['previousBookings', userId],
    queryFn: getPreviousBookings,
    enabled: !!userId,
  });
}