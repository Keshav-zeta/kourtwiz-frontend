import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://44.216.113.234:8080/api/membership-plans/create';

interface Perks {
  advanceBookingDays: number;
  openPlaySessionsAllowed: number;
  tournamentAccess: number;
  guestPasses: number;
  coachingSessions: number;
}

interface CustomPerk {
  name: string;
  value: string;
}

interface MembershipData {
  membershipName: string;
  duration: string;
  price: number;
  perks: Perks;
  customPerks: CustomPerk[];
}

interface UseMutateCreateClubMembershipProps {
  clubId: string;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useMutateCreateClubMembership = ({
  clubId,
  onSuccessCallback,
  onErrorCallback,
}: UseMutateCreateClubMembershipProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (membershipData: MembershipData) => {
      if (!clubId) {
        throw new Error('Club ID is required to create a membership.');
      }
      const payload = {
        ...membershipData,
        clubId,
      };

      const response = await axios.post(`${API_BASE_URL}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Membership created successfully!');
      queryClient.invalidateQueries({ queryKey: ['clubMemberships', clubId] });
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.error('Error creating membership:', error);
      toast.error('Failed to create membership. Please try again.');
      onErrorCallback?.(error);
    },
  });
};
