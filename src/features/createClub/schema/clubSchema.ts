import { z } from 'zod';

export const clubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  logoUrl: z.string().url('Enter a valid Logo URL'),
  bannerUrl: z.string().url('Enter a valid Banner URL'),
  clubEmailId: z.string().email('Enter a valid email'),
  clubOwnerName: z.string().min(1, 'Owner name is required'),
  clubPhoneNumber: z.string().min(10, 'Phone number is required'),
  clubAddress: z.string().min(1, 'Address is required'),
  clubCity: z.string().min(1, 'City is required'),
  clubState: z.string().min(1, 'State is required'),
  clubCountry: z.string().min(1, 'Country is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  websiteUrl: z.string().url('Enter a valid website URL'),
  paymentDetails: z.object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry format (MM/YY)'),
    cardHolderName: z.string().min(1, 'Cardholder name is required'),
    cardTypeEnum: z.enum(['VISA', 'MASTERCARD', 'AMEX']),
  }),
});

export type ClubSchema = z.infer<typeof clubSchema>;
