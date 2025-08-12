// multer is used to upload files in text,pdf,video and photo

/*
How it works

  Multer intercepts the request before it reaches your route handler.
  It checks if the request contains a file.
  It stores the file based on your configuration (diskStorage or memoryStorage).
  It adds a req.file or req.files object to your request, containing:
    File name
    Path
    Size
    MIME type (image/png, video/mp4, etc.)


*/

import multer from "multer"

const storage=multer.diskStorage({ // cb is callback function
  destination:(req,file,cb)=>{
    cb(null,"../public/temp/"); // floder to store files
  },

  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const upload=multer({storage})

export {upload}