import { UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetOrganizations(): UseQueryResult<unknown, Error> {
  const getOrganizations = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://44.216.113.234:8080/organizations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  return useQuery<unknown, Error>({
    queryKey: ['organization'],
    queryFn: () => getOrganizations(),
  });
}
