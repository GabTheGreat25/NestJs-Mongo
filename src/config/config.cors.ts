import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { allowedOrigins } from "src/config";
import { STATUSCODE } from "src/constants/index";

export function addCorsOptions(): CorsOptions {
  return {
    origin: (origin: string, callback: Function) =>
      allowedOrigins.indexOf(origin || "") !== STATUSCODE.NEGATIVE_ONE ||
      !origin
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS")),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    preflightContinue: false,
    exposedHeaders: ["Access-Control-Allow-Origin"],
  };
}
