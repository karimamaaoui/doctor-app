const DemandDoctorModel = require("../models/demandDoctorModel");
const StateDemand = require("../models/enums/StateDemand");
const User = require("../models/userModel");
const { sendAcceptanceEmail } = require("../utils/sendEmail");

const sendDemand = async (req, res) => {
  try {
    const {
      state,
      diploma,
      experienceYears,
      address,
      location,
      phoneNumber,
      hospital,
      socialLinks,
      specialities
    } = req.body;

    if (
  
      !diploma ||
      !experienceYears ||
      !address ||
      !location ||
      !phoneNumber|| !specialities
    ) {
      return res.status(404).json({ message: "Fields required" });
    }

    const clientId = req.user;
    console.log("client id", clientId);

    const newDemand = new DemandDoctorModel({
      state: StateDemand.INPROGRESS,
      client: clientId,
      diploma: diploma,
      experienceYears: experienceYears,
      address: address,
      location: location,
      phoneNumber: phoneNumber,
      hospital: hospital,
      socialLinks: socialLinks,
      specialities:specialities
    });

    // Save the demand to the database
    await newDemand.save();

    res
      .status(201)
      .send({ message: "Demand sent successfully", demand: newDemand });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getDemand = async (req, res) => {
  try {
    const demands = await DemandDoctorModel.find({
      state: "IN PROGRESS",
    }).populate("client", "email");
    res.json(demands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateDemandState = async (req, res) => {
  try {
    const { state } = req.body;
    const demandId = req.params.id;
    console.log("state", state);
    console.log("demand id", demandId);
    // Validate request body : state
    if (!state) {
      return res.status(400).json({ message: "state is a required field" });
    }

    // Find the demand by ID
    const demand = await DemandDoctorModel.findById(demandId);
    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    // Update the state of the demand
    demand.state = state;
    await demand.save();

    if (state === "ACCEPTED") {
      // Fetch user details from the database using the demand.client ID
      const user = await User.findById(demand.client);

      // Check if the user exists and has an email
      if (user && user.email) {
        // Replace 'user.email', 'user.username', and 'link' with appropriate values
        await sendAcceptanceEmail(
          user.email,
          user.firstname,
          "https://example.com"
        );

        user.role = 'DOCTOR';
        await user.save();
      } else {
        console.log("User not found or does not have an email");
      }
    }

    res.status(200).json({
      message: "Demand state updated successfully",
      updatedDemand: demand,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getDoctorsWithSpec = async (req , res) =>{
  try {
    const { specialityId } = req.params;

    const doctors = await DemandDoctorModel.find({ 
      specialities: specialityId, 
      state: "ACCEPTED"  
    })
    .populate("client") 
    .populate("specialities"); 

   
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  sendDemand,
  getDemand,
  updateDemandState,
  getDoctorsWithSpec,
};
