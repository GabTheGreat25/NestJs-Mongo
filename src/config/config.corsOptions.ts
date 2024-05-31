import allowedOrigins from "./config.allowedOrigins";
import { STATUSCODE } from "../constants/index";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export function addCorsOptions(): CorsOptions {
  return {
    origin: (origin, callback) =>
      allowedOrigins.indexOf(origin || "") !== STATUSCODE.NEGATIVE_ONE ||
      !origin
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS")),
    credentials: true,
    exposedHeaders: ["Access-Control-Allow-Origin"],
  };
}
