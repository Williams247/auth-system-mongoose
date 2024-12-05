import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export class NetworkRequest {
		private defaultHeader: Record<string, string>;
		
		constructor() {
				this.defaultHeader = {
						Accept: "application/json",
						"Content-Type": "application/json"
				};
		}
		
		// Request method for POSTMARK email service
		postMarkRequest() {
				let axiosInstance: axios.AxiosInstance;
				axiosInstance = axios.create({
						baseURL: process.env.POSTMARK_BASEURL,
						headers: {
								...this.defaultHeader,
								"X-Postmark-Server-Token": process.env.POSTMARK_TOKEN
						}
				});
				
				return axiosInstance;
		}
		
		// Request method for PAYSTACK payment gateway
		paystackRequest() {
				let axiosInstance: axios.AxiosInstance;
				axiosInstance = axios.create({
						baseURL: process.env.PAYSTACK_BASEURL,
						headers: {
								...this.defaultHeader,
								Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`
						}
				});
				
				return axiosInstance;
		}
}