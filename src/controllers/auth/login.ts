import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../../models/user";
import { Status } from "../../utils/types/default";
import { networkResponse } from "../../utils/helpers/network-response";
import { fetchOneWithMoreParams } from "../../services/fetch";
import dotenv from "dotenv";

dotenv.config();

const {
		NOT_FOUND,
		FORBIDDEN,
		SUCCESS,
		UNAUTHORIZED,
		SERVER_ERROR
} = networkResponse;

export async function login(request: Request, response: Response): Promise<void> {
		try {
				const {
						email, password
				} = request.body;
				
				const result = await fetchOneWithMoreParams({
						model: UserModel,
						searchParams: { email: email },
						selectParms: "firstName lastName email password verified role image disabled"
				});
				
				if (!result.success) {
						response.status(Status.NOT_FOUND).json(NOT_FOUND("Wrong email or password"));
						return;
				}
				
				const userPassword = await bcrypt.compare(password, result.data.password);
				
				if (!userPassword) {
						response.status(Status.NOT_FOUND).json(NOT_FOUND("Wrong email or password"));
						return;
				}
				
				if (!result.data.verified) {
						response.status(Status.UNAUTHORIZED).json(UNAUTHORIZED("You're not verified"));
						return;
				}
				
				if (result.data.disabled) {
						response.status(Status.FORBIDDEN).json(FORBIDDEN("You're disabled, contact your admin"));
						return;
				}
				
				const payload = {
						id: result.data._id
				};
				
				const token = jwt.sign(payload, process.env.APP_SECRET as string, {
						expiresIn: 3600
				});
				
				response.status(Status.SUCCESS).json({
						...SUCCESS(), data: {
								user: payload,
								token: `Bearer ${token}`
						}
				});
		} catch (error) {
				console.log(error);
				response.status(Status.SERVER_ERROR).json(SERVER_ERROR());
		}
}