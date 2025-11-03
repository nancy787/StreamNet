
import connectDB from "./db/index.js";
import dotenv from "dotenv"
// require('dotenv').config({ path : './env'})
dotenv.config({
    path: "./env"
})

connectDB()


















// Approach 1 to connect databse
/*import express from "express";
const app = express()
// using iffi
(async () => {
    try{
       await mongoose.connect( `${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) =>  {
          console.log('Error : ', error);
          throw error
       })
       app.listen( process.env.PORT, () => {
        console.log(`App is listing on port ${process.env.PORT}`);
        
       })
    }catch(error){
        console.log(`Error ${error}`);
        throw err
    }
}) ()
function connectDB() {

}
*/

// Second Approach to connect woth databse