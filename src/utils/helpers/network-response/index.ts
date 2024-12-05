import { Status } from "../../types/default";
import { ResponseFunc } from './type';

export const networkResponse: Record<string, ResponseFunc> = {
		CREATED(message?: string) {
				return {
						status: Status.CREATED,
						success: true,
						message: message ?? "Record created"
				};
		},
		
		SUCCESS(message?: string) {
				return {
						status: Status.SUCCESS,
						success: true,
						message: message ?? "Success"
				};
		},
		
		BAD_REQUEST(message?: string) {
				return {
						status: Status.BAD_REQUEST,
						success: false,
						message: message ?? "Made a bad request"
				};
		},
		
		UNAUTHORIZED(message?: string) {
				return {
						status: Status.UNAUTHORIZED,
						success: false,
						message: message ?? "Unauthorized"
				};
		},
		
		FORBIDDEN(message?: string) {
				return {
						status: Status.FORBIDDEN,
						success: false,
						message: message ?? "You are not allowed to take this action"
				};
		},
		
		NOT_FOUND(message?: string) {
				return {
						status: Status.NOT_FOUND,
						success: false,
						message: message ?? "Record not found"
				};
		},
		
		CONFLICT(message?: string) {
				return {
						status: Status.CONFLICT,
						success: false,
						message: message ?? "Record already exist"
				};
		},
		
		GONE(message?: string) {
				return {
						status: Status.GONE,
						success: false,
						message: message ?? "Expired"
				}
		},
		
		UNPROCESSABLE_CONTENT(message?: string) {
				return {
						status: Status.UNPROCESSABLE_CONTENT,
						success: false,
						message: message ?? "Unprocessable Content"
				}
		},
		
		SERVER_ERROR(message?: string) {
				return {
						status: Status.SERVER_ERROR,
						success: false,
						message: message ?? "Server Error"
				};
		}
};
