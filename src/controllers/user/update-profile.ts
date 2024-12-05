import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import { fetchById } from "../../services/fetch";
import { networkResponse } from "../../utils/helpers/network-response";
import { Status } from "../../utils/types/default";

const {
		SUCCESS, SERVER_ERROR
} = networkResponse;

export async function updateProfile(request: Request, response: Response): Promise<void> {
		try {
				const userId = request.user.id;
				
				const {
						firstName, lastName
				} = request.body;
				
				const result = await fetchById({
						model: UserModel, id: userId ?? ""
				});
				
				if (!result.success) {
						response.status(result.status).json(result);
						return;
				}
				
				const user = await UserModel.findByIdAndUpdate(userId);
				if (user) {
						user.firstName = firstName ?? user.firstName;
						user.lastName = lastName ?? user.lastName;
						await user.save();
						response.status(Status.SUCCESS).json(SUCCESS("Profile updated"));
				}
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}
