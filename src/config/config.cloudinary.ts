import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { ENV } from "src/config";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY.NAME,
  api_key: ENV.CLOUDINARY.KEY,
  api_secret: ENV.CLOUDINARY.SECRET,
});

const storage = new CloudinaryStorage({ cloudinary: cloudinary });

export { storage };
