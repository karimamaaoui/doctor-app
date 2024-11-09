const mongoose = require('mongoose')
const colors= require("colors");

const connectDb= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected ${mongoose.connection.host}`.bgGreen.white);
    }
    catch(error){
        console.log(`Mongodb server issue ${error}`.bgRed.white)
    }
}


module.exports=connectDb