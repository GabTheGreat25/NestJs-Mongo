import { Logger } from "@nestjs/common";
import { MetaData, ResponsePayload } from "src/types";

const logger = new Logger("ResponseHandler");

export function responseHandler(
  data: any,
  message: string,
  meta: MetaData = {},
): ResponsePayload {
  const isSuccess = data !== null && data !== undefined;

  const response = {
    status: isSuccess ? "success" : "fail",
    data: data || [],
    message: message,
    meta: meta,
  };

  logger.log(`Response: ${JSON.stringify(response)}`);

  return response;
}
