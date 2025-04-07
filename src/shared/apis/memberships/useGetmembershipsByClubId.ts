import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchClubMemberships = async (clubId: string) => {
  const { data } = await axios.get(
    `http://44.216.113.234:8080/api/membership-plans/${clubId}`,
    {
      headers: {
        Accept: '*/*',
      },
    }
  );
  return data;
};

export const useGetmembershipsByClubId = (clubId: string) => {
  return useQuery({
    queryKey: ['clubMemberships', clubId],
    queryFn: () => fetchClubMemberships(clubId),
    enabled: !!clubId, // Only fetch if clubId is available
  });
};
