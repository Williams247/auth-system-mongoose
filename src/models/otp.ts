import mongoose from "mongoose";
import { OtpPayload } from "./type";

const Schema = mongoose.Schema;

const otp = new Schema<OtpPayload>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  otpCode: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

otp.set("timestamps", true);

export const OtpModel = mongoose.model("otp", otp);