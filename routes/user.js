const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth")
const profileUpload=require("../middleware/profilePicture")
const {sendOtp,generateToken,verifyOtp,createProfile, getUser, getUserProfile, updateUserProfile, logout, getNotifications, deleteNotifications, setVerificationDocuments}=require("../controllers/userController");
const isVerifiedUser=require("../middleware/isVerifiedUser");
const documentUpload=require("../middleware/verificationDocuments")
const limiter = require("../middleware/rateLimit");
const loginLimiter = require("../middleware/loginRateLimit");

router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/generateToken",generateToken);
router.post("/create-profile",auth,profileUpload.single("file"),createProfile);
router.post("/updateProfile",auth,profileUpload.single("file"),updateUserProfile);   

router.post("/uploadDocuments",auth,documentUpload,setVerificationDocuments);

//delete notification
router.delete("/deleteNotifications",auth,deleteNotifications);

router.get("/getNotifications",auth,getNotifications);
// router.get("/getUser/:id",auth,getUser);
router.get("/getUser/:id",auth,isVerifiedUser,getUser);
router.get("/getUserProfile",auth,getUserProfile);
router.get("/logout",logout)
module.exports=router;  
