import * as fs from "fs";
import * as handlebars from "handlebars";
import * as path from "path";
import { ENV, transporter } from "src/config";

export const sendEmail = async (email: string, randomCode: string) => {
  const templatePath = fs.existsSync(
    path.join(process.cwd(), "src", "views", "reset.html"),
  )
    ? path.join(process.cwd(), "src", "views", "reset.html")
    : path.join(process.cwd(), "dist", "views", "reset.html");

  const templateContent = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateContent);

  const htmlContent = template({ randomCode });

  await transporter.sendMail({
    from: ENV.EMAIL,
    to: email,
    subject: "Reset Account Password",
    html: htmlContent,
  });
};
