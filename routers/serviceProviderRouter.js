const router = require('express').Router();
const serviceProviderController = require('../controller/serviceProviderController');
const upload = require('../middleware/multer');
const {verify} = require('../middleware/authServiceProvider')

router.post('/signUp',upload.any(), serviceProviderController.signUpServiceProvider);
router.patch('/sendOtp', serviceProviderController.sendOtpServiceProvider);
router.patch('/verify', serviceProviderController.verifyServiceProvider);
router.get('/signIn', serviceProviderController.signInServicreProvider);
router.post('/addAddress', verify, serviceProviderController.addServiceProviderAddress);
router.post('/addDetail', verify, serviceProviderController.addServiceProviderDetail);
router.patch('/addPersonalizeDetail', verify, serviceProviderController.addServiceProviderPersonalizeDetail);
router.post('/addPicture', verify,upload.any(), serviceProviderController.addServiceProviderPictures);
router.get('/allDetail', verify, serviceProviderController.showAllDetails);

// create custom services ----------------- 
router.post('/createCustomServices', verify, serviceProviderController.createCustomService);



module.exports = router;