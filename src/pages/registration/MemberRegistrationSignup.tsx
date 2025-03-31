import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./MemberRegistrationSignup.css";
import { useMutateSignUpMember } from "../../features/member-registration/api/useMutateSignupMember";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSendOTP } from "../../features/member-registration/api/useSendOTP";
import { useValidateOTP } from "../../features/member-registration/api/useValidateOTP";
import { TextField, Button, Grid, Typography, Paper, Divider, MenuItem } from "@mui/material";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    profilePictureUrl: z.string().url("Invalid URL").optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    emailOTP: z.string().min(6, "Email OTP is required"),
    phoneOTP: z.string().optional(),
    skillLevel: z.string().min(1, "Skill level is required"),
    preferredTime: z.string().min(1, "Preferred time is required"),
    paymentDetails: z.object({
      cardNumber: z.string().min(16, "Card number must be 16 digits"),
      cvv: z
        .string()
        .min(3, "CVV must be at least 3 digits")
        .max(4, "CVV must be at most 4 digits"),
      expiryDate: z.string().min(5, "Expiry date is required"),
      cardHolderName: z.string().min(1, "Cardholder name is required"),
      cardTypeEnum: z
        .enum(["VISA", "MASTERCARD", "AMEX"])
        .default("VISA"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

const MemberRegistrationSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clubId, clubName, membershipId } = location.state || {};
  const { mutate } = useMutateSignUpMember({
    onSuccessCallback: () => {
      toast.success("Member created!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    },
    onErrorCallback: () => {
      toast.error("Error while assigning role");
    },
  });

  const { emailOTP, phoneOTP } = useSendOTP();
  const validateOTP = useValidateOTP();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const emailOtpValue = watch("emailOTP");
  const phoneOtpValue = watch("phoneOTP");

  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [isEmailOtpValid, setIsEmailOtpValid] = useState<boolean | null>(null);
  const [isPhoneOtpValid, setIsPhoneOtpValid] = useState<boolean | null>(null);

  const sendEmailOTP = () => {
    if (!email) {
      toast.error("Enter a valid email first.");
      return;
    }
    emailOTP.mutate(email, {
      onSuccess: () => {
        setEmailSent(true);
        toast.success("OTP sent to email!");
      },
      onError: () => toast.error("Failed to send OTP."),
    });
  };

  const sendPhoneOTP = () => {
    if (!phoneNumber) {
      toast.error("Enter a valid phone number first.");
      return;
    }
    phoneOTP.mutate(phoneNumber, {
      onSuccess: () => {
        setPhoneSent(true);
        toast.success("OTP sent to phone!");
      },
      onError: () => toast.error("Failed to send OTP."),
    });
  };

  useEffect(() => {
    if (emailOtpValue?.length === 6) {
      validateOTP.mutate(
        { recipient: email, otp: emailOtpValue },
        {
          onSuccess: (isValid) => {
            setIsEmailOtpValid(isValid);
            toast.success("OTP verified");
          },
          onError: () => setIsEmailOtpValid(false),
        }
      );
    }
  }, [emailOtpValue]);

  useEffect(() => {
    if (phoneOtpValue?.length === 6) {
      validateOTP.mutate(
        { recipient: phoneNumber, otp: phoneOtpValue },
        {
          onSuccess: (isValid) => {
            setIsPhoneOtpValid(isValid);
            toast.success("OTP verified");
          },
          onError: () => setIsPhoneOtpValid(false),
        }
      );
    }
  }, [phoneOtpValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      currentActiveClubId: clubId, 
      membershipTypeId: membershipId,
    };
  
    mutate(payload);
  };

  return (
    <Paper elevation={3} className="signup-container" sx={{ p: 4 }}>
      <img
        src="/src/assets/memberSignup.jpg"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.5,
        }}
      />
      <div className="signup-form">
        <Typography variant="h4" className="company-name">
          {clubName || "Company Name"}
        </Typography>
        <Typography variant="h6" className="signup-heading">
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* PERSONAL INFO SECTION */}
            <Grid item xs={12}>
              <Typography variant="h6">Personal Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Profile Picture URL", name: "profilePictureUrl" },
              {
                label: "Date of Birth",
                name: "dateOfBirth",
                type: "date",
                shrink: true,
              },
              { label: "Gender", name: "gender" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Country", name: "country" },
              { label: "Zip Code", name: "zipCode" },
              { label: "Skill Level", name: "skillLevel" },
              { label: "Preferred Time", name: "preferredTime" },
              { label: "Password", name: "password", type: "password" },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
              },
            ].map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  type={type || "text"}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  fullWidth
                  InputLabelProps={
                    type === "date" ? { shrink: true } : undefined
                  }
                />
              </Grid>
            ))}

            {/* VERIFICATION SECTION */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Verification</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Button
                onClick={sendEmailOTP}
                disabled={emailSent}
                variant="outlined"
                sx={{ height: "100%" }}
              >
                {emailSent ? "OTP Sent" : "Send Email OTP"}
              </Button>
              <TextField
                label="Email OTP"
                {...register("emailOTP")}
                error={!!errors.emailOTP}
                helperText={errors.emailOTP?.message}
                fullWidth
              />
            </Grid>

            {/* Phone Number & OTP */}
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <TextField
                label="Phone Number"
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                fullWidth
              />
              <Button
                onClick={sendPhoneOTP}
                disabled={!phoneSent}
                variant="outlined"
                sx={{ height: "100%" }}
              >
                {phoneSent ? "OTP Sent" : "Send OTP"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone OTP"
                {...register("phoneOTP")}
                error={!!errors.phoneOTP}
                helperText={errors.phoneOTP?.message}
                fullWidth
                disabled
              />
            </Grid>

            {/* PAYMENT DETAILS SECTION */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Payment Details</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {[
              {
                label: "Card Number",
                name: "paymentDetails.cardNumber",
                type: "text",
              },
              { label: "CVV", name: "paymentDetails.cvv", type: "password" },
              {
                label: "Expiry Date",
                name: "paymentDetails.expiryDate",
                type: "text",
              },
              {
                label: "Cardholder Name",
                name: "paymentDetails.cardHolderName",
                type: "text",
              },
            ].map(({ label, name, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  type={type}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  fullWidth
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Card Type"
                {...register("paymentDetails.cardTypeEnum")}
                error={!!errors.paymentDetails?.cardTypeEnum}
                helperText={errors.paymentDetails?.cardTypeEnum?.message}
                fullWidth
              >
                {["VISA", "MASTERCARD", "AMEX"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Paper>
  );
};

export default MemberRegistrationSignupPage;
