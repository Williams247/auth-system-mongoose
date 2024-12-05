import { NextFunction, Request, Response } from "express";
import { networkResponse } from "../../utils/helpers/network-response";
import { Role, Status, UserPayload } from '../../utils/types/default';
import Joi from "joi";

const { BAD_REQUEST } = networkResponse;

export function validateUpdateProfile(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UserPayload>({
				firstName: Joi.string().required().label("First Name"),
				lastName: Joi.string().required().label("Last Name"),
				image: Joi.string().allow(" ").label("Profile Image"),
				role: Joi.string().valid(Role.CUSTOMER, Role.ADMIN).label("Role").optional().allow(" ")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateUpdatePassword(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UserPayload>({
				currentPassword: Joi.string().required().label("Current Password"),
				newPassword: Joi.string().alphanum().min(5).max(40).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
						"string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
						"string.empty": `New password cannot be empty`,
						"any.required": `New password is required`
				})
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}
