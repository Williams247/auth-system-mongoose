export enum ServiceTypes {
		PAYSTACK = "PAYSTACK",
		POSTMARK = "POSTMARK",
}

export interface AxiosTypes {
		serviceType: ServiceTypes;
		header?: Record<string, string>;
}