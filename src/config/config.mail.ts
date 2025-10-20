import { createTransport } from "nodemailer";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";

export const transporter = createTransport({
  service: RESOURCE.GMAIL,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASS,
  },
});
