// FIle handlineg
import { v2 as cloudinary } from "cloudinary";
import fs from "fs" //fileSystem default inn  node js no need to import

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

const uploadOnCloundinary = async( LocalFIlePath ) => {
    try {
        if(!LocalFIlePath) return null
        const response =  await cloudinary.uploader.upload(LocalFIlePath, {
            resource_type : "auto"
        })
        // File has been uploaded succefully
        console.log('File uploded on clodinary', response.url);
        fs.unlinkSync(LocalFIlePath)
        return response;
    }catch(error){
        fs.unlinkSync(LocalFIlePath)
        // remove saved  tempory file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloundinary}