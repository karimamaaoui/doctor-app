const mongoose=require("mongoose")
const status= require("./enums/AppointmentStatus")
const type= require("./enums/AppointmentType")
const Schema = mongoose.Schema;


const appointmentSchema = mongoose.Schema ({

    dateAppointment:{
        type: Date ,
        required : true,
    },
    duration :{
        type: Number,
        default : 0.5
    },
    status:{
        type: String,
        enum : Object.values(status),
        default : status.UNPLANNED
    },
    type :{
        type : String ,
        enum : Object.values(type),
        required : true , 
        default : type.ONLINE
    },
    doctor:{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },
    patient:{
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
},
{
    timestamps: true,
  }
)

module.exports  = mongoose.model("Appointment",appointmentSchema)