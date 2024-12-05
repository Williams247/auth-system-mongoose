import { Status } from "../utils/types/default";
import { FetchByIdProps, FetchOneWithMoreParamsProps, FetchProps, FetchSingleRecordType, ServiceResponseType } from '../utils/types/common'

export async function fetchAll({
		model,
		page,
		limit,
		searchParams,
		populate,
		countParams,
		selectParms
}: FetchProps): Promise<ServiceResponseType> {
		try {
				const pageRequest = Number(page ?? 1);
				const limitRequest = Number(limit ?? 10);
				
				const count = await model.countDocuments(countParams ?? {});
				
				const responseData = await model.find({ ...searchParams }).skip((pageRequest - 1) * limitRequest).limit(limitRequest).populate(populate ?? "").select(selectParms ?? "-password");
				
				if (!responseData) {
						return {
								status: Status.NOT_FOUND,
								success: false,
								message: "Resource not found",
								data: null
						};
				}
				
				return {
						status: Status.SUCCESS,
						success: true,
						message: "Success",
						data: {
								totalItems: count,
								currentPage: pageRequest,
								pages: Math.ceil(count / limitRequest),
								results: responseData
						}
				};
		} catch (error) {
				throw error;
		}
};

export async function fetchAllWithoutPaginate({
		model,
		searchParams,
		populate,
		countParams,
		selectParms
}: FetchProps): Promise<ServiceResponseType> {
		const responseData = await model.find({ ...searchParams }).populate(populate ?? "").select(selectParms ?? "-password");
		
		const count = await model.countDocuments(countParams ?? {});
		
		if (!responseData) {
				return {
						status: Status.NOT_FOUND,
						success: false,
						message: "Resource not found",
						data: null
				};
		}
		
		return {
				status: Status.SUCCESS,
				success: true,
				message: "Success",
				data: {
						totalItems: count,
						results: responseData
				}
		};
};

export async function fetchById({
		model, id, selectParms
}: FetchByIdProps): Promise<FetchSingleRecordType> {
		try {
				const data = await model.findById(id).select(selectParms ?? "-password");
				if (!data) {
						return {
								status: Status.NOT_FOUND,
								success: false,
								message: "Resource not found",
								data: null
						};
				}
				
				return {
						status: Status.SUCCESS,
						success: true,
						message: "Success",
						data
				};
		} catch (error) {
				throw error;
		}
};

export async function fetchOneWithMoreParams({
		model,
		searchParams,
		selectParms,
		populate
}: FetchOneWithMoreParamsProps) {
		try {
				const data = await model.findOne(searchParams).populate(populate ?? "").select(selectParms ?? "-password");
				if (!data) {
						return {
								status: Status.NOT_FOUND,
								success: false,
								message: "Resource not found",
								data: null
						};
				}
				
				return {
						status: Status.SUCCESS,
						success: true,
						message: "Success",
						data
				};
		} catch (error) {
				throw error;
		}
};
