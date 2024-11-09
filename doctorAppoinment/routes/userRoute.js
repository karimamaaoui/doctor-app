const express =require("express");
const router=express.Router();
const usersController =require("../controllers/userController");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyRole=require("../middlewares/verifyRole")

router.use(verifyJWT)
router.use(verifyRole)

router.route("/").get((req, res) => {

    if (req.userRole === "ADMIN") {
      // Only ADMIN can view all users
      usersController.getAllUsers(req, res);
    } else {
      // Handle other scenarios or send an appropriate response
      console.log("user role ",req.userRole)

      res.status(403).json("Unauthorized: Invalid role");

    }
  });


  router.route("/getuser").get((req, res) => {
    if (req.userRole === "CLIENT") {
    usersController.getUser(req, res);
  }else {
    // Handle other scenarios or send an appropriate response
    res.status(403).json("Unauthorized: Invalid role");
  }
  });

  router.put('/update', usersController.updateProfile);


  
  router.route("/addnewuser").post((req, res) => {
    if (req.userRole === "ADMIN") {
      // Only ADMIN can change  state of demand
      usersController.createUser(req,res);
    } else {
      // Handle other scenarios or send an appropriate response
      res.status(403).json("Unauthorized: Invalid role");
    }
  });


  
  router.route("/update-user/:id").put((req, res) => {
      // Only ADMIN can change  state of demand
      usersController.updateUser(req,res);
  
  });


  router.route("/delete-user/:id").delete((req, res) => {
    if (req.userRole === "ADMIN") {
      // Only ADMIN can change  state of demand
      usersController.deleteUser(req,res);
    } else {
      // Handle other scenarios or send an appropriate response
      res.status(403).json("Unauthorized: Invalid role");
    }
  });

  router.route("/get-user/:id").get((req, res) => {
      usersController.getUserById(req,res);
  
  });

  router.route('/:id/change-password').patch((req,res)=>{
    usersController.changePassword(req,res);
  })
  
module.exports=router