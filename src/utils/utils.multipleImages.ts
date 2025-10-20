import { v2 as cloudinary } from "cloudinary";
import { RESOURCE } from "src/constants";
import { UploadImages } from "src/types";

export async function multipleImages(
  files: Express.Multer.File[],
  oldImagePublicIds: string[],
): Promise<UploadImages[]> {
  void Promise.all(
    oldImagePublicIds
      .filter(Boolean)
      .map((publicId) => cloudinary.uploader.destroy(publicId)),
  );

  return Promise.all(
    files.map(
      (file) =>
        new Promise<UploadImages>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: RESOURCE.IMAGES }, (error, result) => {
              resolve({
                public_id: result.public_id,
                url: result.secure_url.replace(
                  /\/([^/]+)$/,
                  `/${file.originalname}`,
                ),
                originalname: file.originalname,
              });
            })
            .end(file.buffer);
        }),
    ),
  );
}
