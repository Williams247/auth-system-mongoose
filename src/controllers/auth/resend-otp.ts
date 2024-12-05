import { Request, Response } from "express";
import { OtpTypes, Status } from "../../utils/types/default";
import { networkResponse } from '../../utils/helpers/network-response';
import { sendOtpMessage } from '../../utils/helpers/send-otp-message'
import { OtpModel } from "../../models/otp";
import { fetchOneWithMoreParams } from "../../services/fetch";
import { sendMail } from "../../services/mailer/send-mail";
import { generateCode } from "../../utils/helpers/generate-otp";

const {
		SUCCESS, SERVER_ERROR
} = networkResponse;

export async function resendOtp(request: Request, response: Response): Promise<void> {
		try {
				const {
						actionType, email
				} = request.body;
				
				const result = await fetchOneWithMoreParams({
						model: OtpModel, searchParams: {
								email: email,
								actionType: actionType
						}, populate: "owner"
				});
				
				if (!result.success) {
						response.status(result.status).json(result);
						return;
				}
				
				// Create new otp for user's email
				const createNewOTP = new OtpModel<OtpTypes>({
						owner: result.data.owner as unknown,
						actionType: actionType,
						otpCode: generateCode(),
						email
				});
				
				const otp = await createNewOTP.save();
				
				await sendMail({
						email: email,
						subject: sendOtpMessage[actionType].subject,
						message: sendOtpMessage[actionType].message,
						otp: otp.otpCode as string,
						username: `${result.data.owner.firstName} ${result.data.owner.lastName}`
				});
				
				response.status(Status.SUCCESS).json(SUCCESS("We've re-sent an otp to your mail, verify it in 30 - 40 seconds"));
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}