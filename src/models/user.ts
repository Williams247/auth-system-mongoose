import mongoose from "mongoose";
import { UserPayload } from "./type";

const Schema = mongoose.Schema;

const user = new Schema<UserPayload>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: String,
  disabled: Boolean,
});

user.set("timestamps", true);

export const UserModel = mongoose.model("user", user);