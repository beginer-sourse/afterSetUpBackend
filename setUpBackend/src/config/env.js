import dotenv from 'dotenv';
dotenv.config({
  path:'/Users/piyushyadav/Documents/web_dev/Backend/afterSetUpBackend/setUpBackend/.env'}); 

  // / This loads .env into process.env


  /*
  You need to import the file that runs dotenv.config() to actually load the .env variables into
  process.env.

  Once loaded, process.env is indeed globally available, but dotenv.config() is not run 
  automatically unless you explicitly import the file where it's called.
  */