import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetClubBookings(clubId: string): UseQueryResult<unknown, Error> {
  const getClubBookings = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://44.216.113.234:8080/api/bookings/club/${clubId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courts');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return useQuery<unknown, Error>({
    queryKey: ['clubBookings', clubId],
    queryFn: getClubBookings,
    enabled: !!clubId,
  });
}