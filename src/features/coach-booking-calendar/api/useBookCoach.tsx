import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface BookingData {
  userId: string;
  coachId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const bookCoach = async (bookingData: BookingData): Promise<AxiosResponse<string>> => {
  const token = localStorage.getItem('jwtToken');

  const response = await axios.post(
    'http://44.216.113.234:8080/api/book-coach',
    null, 
    {
      params: {
        userId: bookingData.userId,
        coachId: bookingData.coachId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export function useBookCoach(handleCloseModal: () => void) {
  const { mutate, isPending } = useMutation<AxiosResponse<string>, Error, BookingData>({
    mutationFn: bookCoach,
    onSuccess: (response) => {
      if (response.status === 200) {
        alert(response.data); 
        handleCloseModal();
      }
    },
    onError: (error) => {
      alert(error.message || 'Something went wrong while booking the coach.');
    },
  });

  return { bookCoach: mutate, bookingLoading: isPending };
}
