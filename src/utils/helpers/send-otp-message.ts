import { OtpActionType } from "../types/default";

export const sendOtpMessage = {
  [OtpActionType.ACCOUNT_VERIFICATION]: {
    subject: "Account Activation",
    message: "Please use the otp below to verify your account",
  },
  [OtpActionType.RECOVER_PASSWORD]: {
    subject: "Forgot Password",
    message: "Please use the otp below to recover your account",
  },
};
