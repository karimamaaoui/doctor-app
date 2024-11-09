const express =require('express')
const colors = require('colors')
const morgan =require('morgan')
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const cors=require("cors")
const corsOptions =require("./config/corsOptions");
const { Server } = require('socket.io');
const http = require('http');
const appointmentController = require('./controllers/appointmentController');
const availibiltyController = require('./controllers/availibiltyController');
const cron = require('node-cron');

//dotenv config
dotenv.config();



//mongodb connection
connectDb();

//rest object
const app= express()


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"],
      credentials: true
    }
  });
  app.use((req, res, next) => {
    req.io = io;  // Attach `io` to the request object
    next();       // Continue to the next middleware or route handler
  });


  io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Lorsqu'un utilisateur rejoint avec son userId
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined`);
      socket.join(userId); // L'utilisateur rejoint une salle avec son userId
    });
  
    // Gérer la déconnexion
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  
//middlewares 
app.use(express.json())
app.use(morgan('dev'))
  
//security of the server 
app.use(cors(corsOptions));
app.use(cors());

//routes
app.use("/auth",require("./routes/authRoute"))
app.use('/users',require('./routes/userRoute'));
app.use('/demand',require('./routes/demandDoctorRoute'));
app.use('/evaluation',require('./routes/EvaluationRoutes'));

app.use("/appointment",require('./routes/appointmentRoute'));
app.use("/availability",require("./routes/availibiltyRoute"));
app.use("/notification",require("./routes/notificationRoute"));

app.use('/specialty',require('./routes/specialtyRoute'));

//appeller le service reminder 
cron.schedule('0 8 * * *', appointmentController.sendReminders); //rappeler de la date du rendez-vou J-1

cron.schedule('0 0 * * *', availibiltyController.deleteOldAvailabilityForAllDoctors); // supprimer les anciens disponibilitées 

cron.schedule('* * * * *', appointmentController.updateAppointmentsStatus); // update status appointment 

//port
const port= process.env.PORT || 5000
//listen port
server.listen(port,()=>{
    console.log(`server is running on port ${port} in Mode ${process.env.DEV_MODE} `.bgCyan.white)
})
