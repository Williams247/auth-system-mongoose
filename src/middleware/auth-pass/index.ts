import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { Role, Status, UserPayload } from "../../utils/types/default";
import { networkResponse } from "../../utils/helpers/network-response";
import { fetchById } from "../../services/fetch";
import { UserModel } from "../../models/user";

export interface Props {
		userType?: Role;
		forAllUsers?: boolean;
}

const {
		UNAUTHORIZED, FORBIDDEN, SERVER_ERROR
} = networkResponse;

export function authPass({
		userType, forAllUsers
}: Props) {
		return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
				try {
						let token = request.headers.authorization;
						
						if (!token) {
								response.status(Status.UNAUTHORIZED).json(UNAUTHORIZED());
								return;
						}
						
						if (!token.startsWith("Bearer ")) {
								response.status(Status.UNAUTHORIZED).json(UNAUTHORIZED("Token must have a bearer prefix"));
								return;
						}
						
						token = token.slice(7, token.length);
						
						const isAuthrized = JWT.verify(token, process.env.APP_SECRET as string) as UserPayload;
						
						if (!isAuthrized) {
								response.status(Status.UNAUTHORIZED).json(UNAUTHORIZED());
								return;
						}
						
						const authorized = (await fetchById({
								model: UserModel,
								id: isAuthrized.id
						}));
						
						if (authorized.data.disabled) {
								response.status(Status.FORBIDDEN).json(FORBIDDEN("You're disabled contact your admin"));
								return;
						}
						
						if (forAllUsers) {
								request.user = authorized.data;
								next();
								return;
						}
						
						if (authorized.data.role !== userType) {
								response.status(Status.UNAUTHORIZED).json(UNAUTHORIZED());
								return;
						}
						
						request.user = authorized.data;
						next();
				} catch (error) {
						console.log(error);
						response.status(Status.SERVER_ERROR).json(SERVER_ERROR("Token is invalid or expired"));
				}
		};
}