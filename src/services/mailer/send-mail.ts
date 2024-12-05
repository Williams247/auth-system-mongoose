import dotenv from "dotenv";
import { networkResponse } from "../../utils/helpers/network-response";
import { FetchSingleRecordType } from '../../utils/types/common'
import { SendMailPayload } from "./type";
import { Template } from "./template";
import { NetworkRequest } from "../../libs/axios";

dotenv.config();

const { SUCCESS } = networkResponse;

export async function sendMail({
		email, subject, message, otp, username
}: SendMailPayload): Promise<FetchSingleRecordType> {
		try {
				const networkRequest = new NetworkRequest();
				await networkRequest.postMarkRequest().post("/email", {
						From: process.env.POSTMARK_SENDER,
						To: email,
						Subject: subject,
						HtmlBody: Template({
								message, username, otp
						}),
						MessageStream: "outbound"
				});
				
				return SUCCESS() as FetchSingleRecordType;
		} catch (error) {
				console.log(error);
				throw error;
		}
}
