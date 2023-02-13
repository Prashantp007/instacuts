const router = require('express').Router()
const orderController=require('../controller/orderController');
const {verify} = require('../middleware/authClient');
const {verifyServiceProvider} = require('../middleware/authServiceProvider');

// cart manage ------------------
router.get('/showServices',verify, orderController.showServices);
router.get('/openService',verify, orderController.openService);
router.post('/addServicesInCart',verify, orderController.addServiceInCart);
router.get('/showCart',verify, orderController.showCart);
router.delete('/removeCartItem',verify, orderController.removeCartItem);

// order manage ------------------
router.post('/placeOrder',verify, orderController.placeOrder);
router.get('/showOrder',verify, orderController.showOrders);

// service Provider take action on orders ------------------
router.get('/showBookingServiceProvider',verifyServiceProvider , orderController.showBookingServiceProvider);
router.post('/takeActionOnOrder',verifyServiceProvider , orderController.takeActionOnOrder);
router.get('/homeScreen',verifyServiceProvider , orderController.homeScreen);
router.patch('/sendOtp',verifyServiceProvider , orderController.sendOTPtoclientForStartService);

router.patch('/verifyOtp&startService',verify , orderController.verifyAndStartService);

router.patch('/completeService',verifyServiceProvider , orderController.completeService);

router.post('/giveReviewOnService',verify , orderController.giveReviewOnService);



module.exports = router; 