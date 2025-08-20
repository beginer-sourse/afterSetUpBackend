// multer is used to upload files in text,pdf,video and photo

/*
How it works

  Multer intercepts the request before it reaches your route handler{Controller}.
  It checks if the request contains a file.
  It stores the file based on your configuration (diskStorage or memoryStorage).
  It adds a req.file or req.files object to your request, containing:
    File name
    Path
    Size
    MIME type (image/png, video/mp4, etc.)


*/

// Multer adds a body object and a file or files object to the request object. The body object 
// contains the values of the text fields of the form, the file or files object contains the 
// files uploaded via the form

import multer from "multer"

const storage=multer.diskStorage({ // cb is callback function
  destination:(req,file,cb)=>{
    cb(null,"/Users/piyushyadav/Documents/web_dev/Backend/afterSetUpBackend/setUpBackend/public/temp"); // floder to store files
  },

  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

/*
upload.fields(...) returns a middleware function created by Multer.
That middleware does internally call next() after it finishes parsing the request and attaching 
the files to req.files.

Because Multer’s middleware is designed to integrate with Express, you don’t see next in your
 multer.js setup, but Multer automatically provides it in the middleware function it creates.
*/

const upload=multer({storage})

export {upload}