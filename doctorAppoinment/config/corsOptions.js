const allowedOrigins=require('./allowedOrigin');

const corsOptions ={
    origin: (origin,callback)=>{
        if (allowedOrigins.indexOf(origin) !== -1 || !origin ) {
            callback(null, true);
        } else {
            console.log(`Error from CORS: ${origin} not in the list`);
            callback(new Error("Not allowed by Cors"));
        }
    },
    //accpet any cookies
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;