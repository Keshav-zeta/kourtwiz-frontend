import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const validateOTP = async ({ recipient, otp }: { recipient: string; otp: string }) => {
  const response = await axios.post(`http://44.216.113.234:8080/temp-otp/validate?recipient=${recipient}&otp=${otp}`);
  return response.data.valid;
};

export const useValidateOTP = () => {
  return useMutation({ mutationFn: validateOTP });
};
