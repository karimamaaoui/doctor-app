const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const verifyRole = require("../middlewares/verifyRole");
const DemandDoctorController = require("../controllers/demandDoctorController");

router.use(verifyJWT);
router.use(verifyRole);

router.route("/add").post((req, res) => {
  if (req.userRole === "PATIENT") {
    // Only patients can send a demand
    DemandDoctorController.sendDemand(req, res);
  } else {
    // Handle other scenarios or send an appropriate response
    console.log("user role ", req.userRole);
    res.status(403).json("Unauthorized: Invalid role");
  }
});

router.route("/suivi").get((req, res) => {
    if (req.userRole === "ADMIN") {
      // Only ADMIN can change  state of demand
      DemandDoctorController.getDemand(req,res);
    } else {
      // Handle other scenarios or send an appropriate response
      res.status(403).json("Unauthorized: Invalid role");
    }
  });


  router.route("/changestate/:id").put((req, res) => {
    if (req.userRole === "ADMIN") {
      // Only ADMIN can change  state of demand
      DemandDoctorController.updateDemandState(req,res);
    } else {
      // Handle other scenarios or send an appropriate response
      res.status(403).json("Unauthorized: Invalid role");
    }
  });



module.exports = router;
