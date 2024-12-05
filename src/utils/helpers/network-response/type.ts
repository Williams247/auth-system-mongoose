import {Status} from "../../types/default";

export interface ResponseType {
  status: Status;
  success: boolean;
  message?: string;
}

export type ResponseFunc = (message?: string) => ResponseType;