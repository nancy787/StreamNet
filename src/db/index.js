import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
      const ConnectionInstance =  await mongoose.connect( `${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`\n MongoDB is connected || DBHOST ${ConnectionInstance.connection.host}`);
        // console.log(ConnectionInstance);
    
    } catch (error) {
        console.log("mongo db connection error", error);
        process.exit(1)
    }
}


export default connectDB