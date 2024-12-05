import {AnyExpression, Model} from "mongoose";
import {Status} from "./default";

type selectParmsProps =
  | string
  | Array<string>
  | Record<string, number | boolean | object>;

type PopulateRecord = string | Array<string>;

export interface FetchProps {
  model: Model<AnyExpression>;
  page?: unknown;
  limit?: unknown;
  searchParams?: {};
  populate?: PopulateRecord;
  countParams?: unknown;
  selectParms?: selectParmsProps;
}

export interface FetchByIdProps {
  model: Model<AnyExpression>;
  id: string | undefined;
  message?: string;
  selectParms?: selectParmsProps;
}

export interface FetchOneWithMoreParamsProps {
  model: Model<AnyExpression>;
  searchParams: {};
  selectParms?: selectParmsProps;
  populate?: PopulateRecord;
}

export interface FetchResponsePayload {
  totalItems?: number;
  currentPage?: number;
  pages?: number;
  results: any;
}

export interface ServiceResponseType {
  status: Status;
  success: boolean;
  message: string;
  data?: FetchResponsePayload | null;
}

export interface FetchSingleRecordType {
  status: Status;
  success: boolean;
  message: string;
  data?: any;
}
