const mongoose = require("mongoose");
const State = require("./enums/StateDemand");

const DemandDoctorSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: State,
      default: State.INPROGRESS,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    diploma: {
      diplomaName: {
        type: String,
        required: [true, "Enter the name of the diploma"],
      },
      year: {
        type: Date,
        required: [true, "Enter the date of the diploma"],
      },
    },
    experienceYears: {
      type: Number,
      required: [true, "Enter the number of years of experience"],
    },
    address: {
      type: String,
      required: [true, "Enter the address"],
    },
    location: {
      city: {
        type: String,
        required: [true, "Enter the city"],
      },
      country: {
        type: String,
        required: [true, "Enter the country"],
      },
      zipCode: {
        type: String,
        required: [true, "Enter the zip code"],
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Enter the phone number"],
    },
    hospital: {
      hospitalName: {
        type: String,
      },
      hospitalNumber: {
        type: String,
      },
      department: {
        type: String,
      },
      hiringDate: {
        type: Date,
      },
    },
    socialLinks: {
      linkedin: {
        type: String,
      },
      facebook: {
        type: String,
      },
    },

    
    specialities: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DemandDoctor", DemandDoctorSchema);
