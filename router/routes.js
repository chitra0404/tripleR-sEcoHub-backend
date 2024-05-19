const express=require('express');
const { getUser, Register, Login, AccountActivation, checkActivation, PasswordResetLink, PasswordUpdate, deleteUser, updateUserProfile, getUserById } = require('../controllers/UserController');
const { getrecycler, RecyclerRegister, RecycleLogin, AccActivation, checkAct, searchRecyclers, getPincode } = require('../controllers/recyclercontroller');
const { getAdmin, adminRegister, admninLogin } = require('../controllers/admincontroller');
const { schedulePickup, pickupRequest, getResponse, updateRate } = require('../controllers/pickupcontroller');
const { auth } = require('../middleware/authMiddleware');
const { getPrice } = require('../controllers/PriceListController');
const { CreateOrder, VerifyPayment } = require('../controllers/paymentController');
const router=express.Router();



//userroutes
router.get("/getuser",auth,getUser);
router.get("/get/:id",auth,getUserById)
router.post("/userregister",Register);
router.post("/userlogin",Login);
router.patch("/activate/:id",AccountActivation);
router.get("/checkacc/:id",checkActivation);
router.put('/forgotPassword',PasswordResetLink)
router.patch('/PasswordReset/:id',PasswordUpdate)
router.delete("/user/:id",deleteUser);
router.put('/profile/:id', auth, updateUserProfile);

//recyclerroutes

router.get("/getrecycler",getrecycler);
router.post("/re-register",RecyclerRegister);
router.post("/re-login",RecycleLogin);
router.patch("/re-activate/:id",AccActivation);
router.get("/checkaccount/:id",checkAct);

//adminroutes
router.get("/getadmin",getAdmin);
router.post("/ad-register",adminRegister);
router.post("/ad-login",admninLogin);

//pickup routes
router.post("/pickup",auth,schedulePickup);
router.put("/pickuprequest/:id/confirm",auth,pickupRequest);
router.put('/pickuprequest/:pickupRequestId',updateRate)
router.get("/pickuprequests",getResponse);
router.get("/search",searchRecyclers);
router.get("/getpincode",getPincode);

router.get("/getprice",getPrice);

router.post("/createOrder",CreateOrder);
router.post("/verifyPayment",VerifyPayment);


module.exports=router;