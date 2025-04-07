import { useMutation, useQueryClient } from '@tanstack/react-query';

const assignRole = async ({
  userEmail,
  organizationName,
  roleName,
}: {
  userEmail: string;
  organizationName: string;
  roleName: string;
}) => {
  const token = localStorage.getItem('jwtToken');

  const response = await fetch('http://44.216.113.234:8080/users/assign-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userEmail,
      organizationName,
      roleName,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || 'Failed to assign role');
  }

  return responseText;
};

export const useMutateAssignRole = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback(error);
    },
  });
};
