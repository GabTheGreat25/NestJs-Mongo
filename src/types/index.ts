import { ClientSession, PipelineStage } from "mongoose";

export interface MetaData {
  [key: string]: any;
}

export interface ResponsePayload {
  status: string;
  data: any;
  message: string;
  meta: MetaData;
}

export interface VerifyCode {
  code?: string;
  createdAt?: Date;
}

export interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

export interface LookupOptions {
  from: string;
  localField: string;
  as: string;
  pipeline?: PipelineStage[];
  project?: PipelineStage.Project;
}

export interface SessionRequest extends Request {
  session?: ClientSession;
}
