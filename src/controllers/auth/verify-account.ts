import { Request, Response } from "express";
import { DateTime } from "luxon";
import { OtpActionType, Status } from "../../utils/types/default";
import { networkResponse } from '../../utils/helpers/network-response'
import { UserModel } from "../../models/user";
import { OtpModel } from '../../models/otp'
import { fetchOneWithMoreParams } from "../../services/fetch";

const {
		GONE, SUCCESS, NOT_FOUND, SERVER_ERROR
} = networkResponse;

export async function verifyAccount(request: Request, response: Response): Promise<void> {
		try {
				const {
						email, otpCode
				} = request.body;
				
				// Find otp model with email and otp
				const otpResult = await fetchOneWithMoreParams({
						model: OtpModel, searchParams: {
								email: email, otpCode: otpCode
						}
				});
				
				// If result is not found return an error message
				if (!otpResult.success) {
						response.status(otpResult.status).json(otpResult);
						return;
				}
				
				// Check if the request date is more than 20 minutes
				const currentDate = DateTime.now();
				const otpDate = DateTime.fromJSDate(otpResult.data.createdAt);
				const timeSpent = Math.round(currentDate.diff(otpDate, "minutes").minutes);
				
				if (timeSpent > 20) {
						response.status(Status.GONE).json(GONE());
						return;
				}
				
				// Find the same user who just registered with the same email
				const res = await fetchOneWithMoreParams({
						model: UserModel,
						searchParams: { email: email }
				});
				
				// If the user does not exist return an error message
				if (!res.success) {
						response.status(Status.NOT_FOUND).json(NOT_FOUND());
						return;
				}
				
				// Update a user by the id to verify their account and delete all the otp created by the same user
				const verifyUser = await UserModel.findByIdAndUpdate(res.data._id);
				
				if (verifyUser) {
						verifyUser.verified = true;
						await verifyUser.save();
						
						await OtpModel.deleteMany({
								email: verifyUser.email,
								actionType: OtpActionType.ACCOUNT_VERIFICATION
						});
						response.status(Status.SUCCESS).json(SUCCESS("Account verified"));
				}
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}