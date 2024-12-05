import { Request, Response } from "express";
import { fetchById } from "../../services/fetch";
import { UserModel } from "../../models/user";
import bcrypt from "bcryptjs";
import { Status } from "../../utils/types/default";
import { networkResponse } from "../../utils/helpers/network-response";

const {
		FORBIDDEN, SUCCESS, SERVER_ERROR
} = networkResponse;

export async function updatePassword(request: Request, response: Response): Promise<void> {
		try {
				const userId = request.user.id;
				
				const {
						currentPassword, newPassword
				} = request.body;
				
				const result = await fetchById({
						model: UserModel,
						id: userId ?? "",
						selectParms: "password"
				});
				
				if (!result.success) {
						response.status(result.status).json(result);
						return;
				}
				
				const doesPasswordMatch = await bcrypt.compare(currentPassword, result.data.password);
				
				if (!doesPasswordMatch) {
						response.status(Status.NOT_FOUND).json(FORBIDDEN("The password you have provided does not match your current password"));
						return;
				}
				
				let updatedPassword;
				
				const user = await UserModel.findByIdAndUpdate(userId);
				if (newPassword) updatedPassword = await bcrypt.hash(newPassword, 10);
				if (user) {
						user.password = updatedPassword ?? user.password;
						await user.save();
						response.status(Status.SUCCESS).json(SUCCESS("Profile updated"));
				}
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}
