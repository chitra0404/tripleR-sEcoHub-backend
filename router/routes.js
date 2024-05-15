const express=require('express');
const { getUser, Register, Login, AccountActivation, checkActivation, PasswordResetLink, PasswordUpdate, deleteUser } = require('../controllers/UserController');
const { getrecycler, RecyclerRegister, RecycleLogin, AccActivation, checkAct } = require('../controllers/recyclercontroller');
const { getAdmin, adminRegister, admninLogin } = require('../controllers/admincontroller');
const { schedulePickup, pickupRequest, getResponse } = require('../controllers/pickupcontroller');
const { auth } = require('../middleware/authMiddleware');
const { getPrice } = require('../controllers/PriceListController');
const router=express.Router();



//userroutes
router.get("/getuser",getUser);
router.post("/userregister",Register);
router.post("/userlogin",Login);
router.patch("/activate/:id",AccountActivation);
router.get("/checkacc/:id",checkActivation);
router.put('/forgotPassword',PasswordResetLink)
router.patch('/PasswordReset/:id',PasswordUpdate)
router.delete("/user/:id",deleteUser);
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
router.get("/pickuprequests",getResponse);

router.get("/getprice",getPrice);


module.exports=router;