const express=require('express');
const { getUser, Register, Login, AccountActivation, checkActivation, PasswordResetLink, PasswordUpdate, deleteUser, updateUserProfile, getUserById } = require('../controllers/UserController');
const { getrecycler, RecyclerRegister, RecycleLogin, AccActivation, checkAct, searchRecyclers, getPincode, deleteRecycler, getProfile, updateProfile } = require('../controllers/recyclercontroller');
const { getAdmin, adminRegister, admninLogin } = require('../controllers/admincontroller');
const { schedulePickup, pickupRequest, getResponse, updateRate, getPickupRequestsByRecyclerId } = require('../controllers/pickupcontroller');
const { auth } = require('../middleware/authMiddleware');
const { getPrice } = require('../controllers/PriceListController');
const { CreateOrder, VerifyPayment, getPaymentById, getpayments } = require('../controllers/paymentController');
const { rauth } = require('../middleware/recyclerMiddleware');
const { addquery, getquery } = require('../controllers/querycontroller');
const { getContent } = require('../controllers/contentController');
const router=express.Router();



//userroutes
router.get("/getuser",getUser);
router.get("/profile/:id",auth,getUserById)
router.post("/userregister",Register);
router.post("/userlogin",Login);
router.patch("/activate/:id",AccountActivation);
router.get("/checkacc/:id",checkActivation);
router.put('/forgotPassword',PasswordResetLink)
router.patch('/PasswordReset/:id',PasswordUpdate)
router.delete("/user/:id",deleteUser);
router.put('/profile/:id', auth, updateUserProfile);

//recyclerroutes
router.delete("/recycler/:id",deleteRecycler);
router.get("/getrecycler",getrecycler);
router.post("/re-register",RecyclerRegister);
router.post("/re-login",RecycleLogin);
router.patch("/re-activate/:id",AccActivation);
router.get("/checkaccount/:id",checkAct);
router.get('/pro/:id',rauth,getProfile);
router.put('/pro/:id',rauth, updateProfile);
router.post('/query',addquery);
router.get('/query',getquery)

//adminroutes
router.get("/getadmin",getAdmin);
router.post("/ad-register",adminRegister);
router.post("/ad-login",admninLogin);

//pickup routes
router.post("/pickup",auth,schedulePickup);
router.put("/pickuprequest/:id/confirm",rauth,pickupRequest);
router.put('/pickuprequest/:pickupRequestId',rauth,updateRate)
router.get("/pickuprequests",getResponse);
router.get("/search",searchRecyclers);
router.get("/getpincode",getPincode);
router.get('/pickuprequests/:recyclerId', getPickupRequestsByRecyclerId);


router.get("/getprice",getPrice);
router.get("/content",getContent);

router.post("/createOrder",rauth,CreateOrder);
router.post("/verifyPayment",rauth,VerifyPayment);
router.get("/getpayment/:id",getPaymentById);
router.get("/payment",getpayments);


module.exports=router;