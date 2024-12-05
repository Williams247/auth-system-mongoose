import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OtpActionType, OtpTypes, Role, Status, UserPayload } from "../../utils/types/default";
import { generateCode } from '../../utils/helpers/generate-otp';
import { networkResponse } from '../../utils/helpers/network-response';
import { UserModel } from "../../models/user";
import { fetchOneWithMoreParams } from "../../services/fetch";
import { OtpModel } from '../../models/otp';
import { sendMail } from "../../services/mailer/send-mail";

const {
		CONFLICT, CREATED, SERVER_ERROR
} = networkResponse;

export async function register(request: Request, response: Response): Promise<void> {
		try {
				const {
						email,
						firstName,
						lastName,
						password,
						role
				} = request.body;
				
				// Return false if there are more than 1 admin
				if (role === Role.ADMIN) {
						const hasManyAdmin = await UserModel.find({ role }).count();
						if (hasManyAdmin > 0) {
								response.status(Status.CONFLICT).json(CONFLICT("An admin already exist"));
								return;
						}
				}
				
				// Check if email already exist
				const result = await fetchOneWithMoreParams({
						model: UserModel,
						searchParams: { email: email }
				});
				
				if (result.success) {
						response.status(Status.CONFLICT).json(CONFLICT(`${email} is already taken.`));
						return;
				}
				
				// Create new password
				const hashedPassword = await bcrypt.hash(password, 10);
				
				// Create an account
				const createUser = new UserModel<UserPayload>({
						email,
						firstName,
						lastName,
						password: hashedPassword,
						role,
						verified: role === Role.ADMIN,
						disabled: false
				});
				
				const newUser = await createUser.save();
				
				if (role === Role.ADMIN) {
						response.status(Status.CREATED).json(CREATED("Account created"));
						return;
				}
				
				// Send an otp to the user who created the email
				const createOtp = new OtpModel<OtpTypes>({
						owner: newUser._id as unknown,
						otpCode: generateCode(),
						email,
						actionType: OtpActionType.ACCOUNT_VERIFICATION
				});
				
				const otp = await createOtp.save();
				
				// Work on this function when the otp issue is resolved
				
				await sendMail({
						email: email,
						subject: "Account Activation",
						otp: otp.otpCode as string,
						username: `${firstName} ${lastName}`,
						message: "Please use the otp below to activate your account"
				});
				
				response.status(Status.CREATED).json(CREATED("We've sent an otp to your mail, verify it in 30 - 40 seconds"));
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}
