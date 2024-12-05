import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import { fetchById } from "../../services/fetch";
import { networkResponse } from "../../utils/helpers/network-response";
import { Status } from '../../utils/types/default';

const { SERVER_ERROR } = networkResponse;

export async function fetchProfile(request: Request, response: Response) {
		try {
				const result = await fetchById({
						model: UserModel,
						id: request.user.id
				});
				
				response.status(result.status).json(result);
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}