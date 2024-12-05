export interface SendMailPayload {
		email: string;
		subject: string;
		message: string;
		otp: string;
		username: string
}

export interface TemplatePayload {
		otp?: string;
		username?: string;
		message: string;
}
