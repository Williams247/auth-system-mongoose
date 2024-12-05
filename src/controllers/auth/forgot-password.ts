import { Request, Response } from "express";
import { OtpActionType, OtpTypes, Status } from "../../utils/types/default";
import { sendOtpMessage } from "../../utils/helpers/send-otp-message";
import { generateCode } from "../../utils/helpers/generate-otp";
import { networkResponse } from "../../utils/helpers/network-response";
import { OtpModel } from "../../models/otp";
import { UserModel } from "../../models/user";
import { fetchOneWithMoreParams } from "../../services/fetch";
import { sendMail } from "../../services/mailer/send-mail";

const {
		SUCCESS, SERVER_ERROR
} = networkResponse;

export async function forgotPassword(request: Request, response: Response): Promise<void> {
		try {
				const { email } = request.body;
				
				// Check to see if a user's email is in the users model
				const result = await fetchOneWithMoreParams({
						model: UserModel,
						searchParams: { email: email }
				});
				
				if (!result.success) {
						response.status(result.status).json(result);
						return;
				}
				
				// Create new otp for user's email if user exist
				const createOTP = new OtpModel<OtpTypes>({
						owner: result.data._id as unknown,
						actionType: OtpActionType.RECOVER_PASSWORD,
						otpCode: generateCode(),
						email
				});
				
				const otp = await createOTP.save();
				
				await sendMail({
						email: email,
						subject: sendOtpMessage[OtpActionType.RECOVER_PASSWORD].subject,
						message: sendOtpMessage[OtpActionType.RECOVER_PASSWORD].message,
						otp: otp.otpCode as string,
						username: `${result.data.firstName} ${result.data.lastName}`
				});
				
				response.status(Status.SUCCESS).json(SUCCESS("We've sent an otp to your mail, verify it in 30 - 40 seconds"));
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}
