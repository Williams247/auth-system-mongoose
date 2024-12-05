import {OtpActionType} from "../utils/types/default";

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
  role: string;
  image?: string;
  disabled?: boolean;
}

export interface OtpPayload {
  owner: unknown;
  email: string;
  otpCode: string;
  actionType: OtpActionType;
}
