import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from 'fs';

//configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_SECRET: process.env.CLOUDINARY_API_SECRET,
})

//to upload files to cloudinary

export async function uploadToCloudinary(filePath, folder = "Doctor") {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "image"
        });
        // remove the local file after upload
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        console.log("Cloudinary upload error:",error);
        throw error;      
    }
}

// to delete an image that is present in cloudinary if user removes from the UI
export async function deleteFromCloudinary(publicID) {
    try {
        if(!publicID) return;
        await cloudinary.uploader.upload.destroy(publicID);
    } catch (error) {
        console.log("Cloudinary upload error:",error);
        throw error; 
    }
}

export default cloudinary;