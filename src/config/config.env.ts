import * as dotenv from "dotenv";
import { RESOURCE } from "src/constants";

dotenv.config({ path: "./src/config/.env" });

const ENV = {
  NODE_ENV: process.env.NODE_ENV || RESOURCE.DEVELOPMENT,
  PORT: process.env.PORT || 4000,
  DATABASE_URI:
    process.env.DATABASE_URI ||
    "mongodb://localhost:27017/YOUR_DATABASE_NAME?directConnection=true",
  SALT_NUMBER: Number(process.env.SALT_NUMBER) || 12,
  JWT_SECRET: process.env.JWT_SECRET || "your_JWT_SECRET",
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
    KEY: process.env.CLOUDINARY_API_KEY || "your_api_key",
    SECRET: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
  },
  EMAIL: process.env.EMAIL || "your_email",
  EMAIL_PASS: process.env.EMAIL_PASS || "your_email_pass",
};

export { ENV };
