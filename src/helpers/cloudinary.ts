import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "team-members",
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading image to Cloudinary");
  }
};
