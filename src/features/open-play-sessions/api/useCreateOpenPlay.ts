import { useMutation } from '@tanstack/react-query';

interface OpenPlaySessionData {
  clubId: string;
  courtId: string;
  startTime: string;
  durationMinutes: number;
  skillLevel: string;
  maxPlayers: number;
}

const createOpenPlaySession = async (sessionData: OpenPlaySessionData): Promise<OpenPlaySessionData> => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch('http://44.216.113.234:8080/api/openplay/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create open play session');
  }

  return response.json();
};



export function useCreateOpenPlay() {
  const { mutate, isPending } = useMutation<OpenPlaySessionData, Error, OpenPlaySessionData>({
    mutationFn: createOpenPlaySession,
    onSuccess: (data) => {
      alert("Session created successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to create open play session.");
    },
  });

  return { mutate, isPending };
}

