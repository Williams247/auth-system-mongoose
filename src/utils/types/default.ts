export enum Status {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  UNPROCESSABLE_CONTENT = 422,
  SERVER_ERROR = 500,
}

export enum OtpActionType {
  ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION",
  RECOVER_PASSWORD = "RECOVER_PASSWORD",
}

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface UserPayload {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
  verified?: boolean;
  role?: string;
  disabled?: boolean;
}

export interface OtpTypes {
  owner?: unknown;
  otpCode?: string;
  actionType?: OtpActionType;
  email?: string;
}

export interface UpdatePasswordPayload {
  email?: string;
  password?: string;
  otpCode?: string;
}

export interface ResetPasswordPayload {
  email: string;
  otpCode: string;
  actionType: OtpActionType.RECOVER_PASSWORD;
  password: string;
}