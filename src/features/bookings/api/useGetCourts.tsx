import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetCourts(clubId: string): UseQueryResult<unknown, Error> {
  const getCourts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://44.216.113.234:8080/courts/club/${clubId}`, {
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
    queryKey: ['courts', clubId],
    queryFn: getCourts,
    enabled: !!clubId,
  });
}
