import { NextFunction, Request, Response } from "express";
import { networkResponse } from "../../utils/helpers/network-response";
import { OtpActionType, OtpTypes, ResetPasswordPayload, Role, Status, UpdatePasswordPayload, UserPayload } from '../../utils/types/default';
import Joi from "joi";

const { BAD_REQUEST } = networkResponse;

export function validateAuthRegister(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UserPayload>({
				firstName: Joi.string().required().label("First Name"),
				lastName: Joi.string().required().label("Last Name"),
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
				password: Joi.string().alphanum().min(5).max(40).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
						"string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
						"string.empty": `Password cannot be empty`,
						"any.required": `Password is required`
				}),
				confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
						"any.only": "Password and Confirm password do not match",
						"any.required": "Confirm password is required"
				}),
				image: Joi.string().allow(" ").label("Profile Image"),
				role: Joi.string().required().valid(Role.CUSTOMER, Role.ADMIN).label("Role")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateAuthLogin(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UserPayload>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
				password: Joi.string().required().label("Password")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateRecoverPassword(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UserPayload>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateVerifyAccount(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UpdatePasswordPayload>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
				otpCode: Joi.string().required().label("otpCode").min(5).max(5)
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateForgotPassword(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<UpdatePasswordPayload>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateResendOtp(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<OtpTypes>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
				actionType: Joi.string().required().valid(OtpActionType.ACCOUNT_VERIFICATION, OtpActionType.RECOVER_PASSWORD)
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}

export function validateResetPassword(request: Request, response: Response, next: NextFunction): void {
		const schema = Joi.object<ResetPasswordPayload>({
				email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
				otpCode: Joi.string().min(5).max(5).label("OTP"),
				actionType: Joi.string().required().valid(OtpActionType.RECOVER_PASSWORD).label("actionType"),
				password: Joi.string().required().label("Password")
		});
		
		const { error } = schema.validate(request.body);
		
		if (error) {
				response.status(Status.BAD_REQUEST).json(BAD_REQUEST(error.message));
				return;
		}
		
		next();
}
