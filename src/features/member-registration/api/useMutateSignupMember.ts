import { useMutation } from "@tanstack/react-query";

const signUp = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currentActiveClubId: string;
  skillLevel: string;
  preferredTime: string;
  membershipTypeId: string;
  paymentDetails: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardHolderName: string;
    cardTypeEnum: string;
  };
}) => {
  const { currentActiveClubId, membershipTypeId } = payload;

  const response = await fetch(
    `http://44.216.113.234:8080/users/assign-club-membership/${currentActiveClubId}?membershipTypeId=${membershipTypeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Error ${response.status}: ${response.statusText} - ${errorMessage}`
    );
  }

  return response;
};

export const useMutateSignUpMember = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback: (data: any) => void;
  onErrorCallback: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  });
};
