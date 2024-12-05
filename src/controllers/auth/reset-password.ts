import { Request, Response } from "express";
import { DateTime } from "luxon";
import bcrypt from "bcryptjs";
import { UserModel } from "../../models/user";
import { OtpModel } from "../../models/otp"
import { fetchOneWithMoreParams } from "../../services/fetch";
import { OtpActionType, Status } from "../../utils/types/default";
import { networkResponse } from "../../utils/helpers/network-response";

const {
		GONE, SUCCESS, SERVER_ERROR
} = networkResponse;

export async function resetPassword(request: Request, response: Response) {
		try {
				const {
						email,
						otpCode,
						actionType,
						password
				} = request.body;
				
				// Find user from otp collection and see if they have had an otp
				const result = await fetchOneWithMoreParams({
						model: OtpModel,
						searchParams: {
								email: email,
								otpCode: otpCode,
								actionType: actionType
						}
				});
				
				// If there is no user throw an error
				if (!result.success) {
						response.status(result.status).json(result);
						return;
				}
				
				// Check time difference and see if it more than 20 minutes
				const currentDate = DateTime.now();
				const otpDate = DateTime.fromJSDate(result.data.createdAt);
				const timeSpent = Math.round(currentDate.diff(otpDate, "minutes").minutes);
				
				if (timeSpent > 20) {
						response.status(Status.GONE).json(GONE());
						return;
				}
				
				const user = await UserModel.findByIdAndUpdate(result.data.owner);
				
				if (user) {
						user.password = await bcrypt.hash(password, 10);
						await user.save();
						await OtpModel.deleteMany({
								email: email,
								actionType: OtpActionType.RECOVER_PASSWORD
						});
						response.status(Status.SUCCESS).json(SUCCESS("Password updated"));
				}
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}
