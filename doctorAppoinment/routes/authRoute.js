const express =require("express");
const router=express.Router();
const authController= require ("../controllers/authController")


router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
router.route("/verify").get(authController.verify);
router.route("/forgot").post(authController.forgotPass);
router.route("/reset-password/:id/:token").post(authController.resetPassword);


module.exports=router


