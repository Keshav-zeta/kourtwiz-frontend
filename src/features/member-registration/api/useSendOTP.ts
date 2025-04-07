import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const sendEmailOTP = async (email: string) => {
  return axios.post(`http://44.216.113.234:8080/temp-otp/send-email?email=${email}`);
};

const sendPhoneOTP = async (phoneNumber: string) => {
  return axios.post(`http://44.216.113.234:8080/otp/send-sms?phone=${phoneNumber}`);
};

export const useSendOTP = () => {
  const emailOTP = useMutation({ mutationFn: sendEmailOTP });
  const phoneOTP = useMutation({ mutationFn: sendPhoneOTP });

  return { emailOTP, phoneOTP };
};
