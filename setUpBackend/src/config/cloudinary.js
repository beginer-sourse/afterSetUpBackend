import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// in this localy save file in server is sending to cloudinary server.


const uploadOnCloudinary = async function (localFilePath) {
  try{
    if(!localFilePath) return null // file path is not found

    // file is uploaded in cloudinary
    const responce=await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
    })
    // console.log("file is uploaded on cloudinary",responce.url);
    
    // Unlinks after Cloudinary confirms success
    if(fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
     
    return responce;
  
  }
  catch(error){ 
    // / remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath)
    return null
  }
}

export {uploadOnCloudinary};
