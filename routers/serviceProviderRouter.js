const router = require('express').Router();
const serviceProviderController = require('../controller/serviceProviderController');
const upload = require('../middleware/multer');
const {verifyServiceProvider} = require('../middleware/authServiceProvider')

router.post('/signUp',upload.any(), serviceProviderController.signUpServiceProvider);
router.patch('/sendOtp', serviceProviderController.sendOtpServiceProvider);
router.patch('/verify', serviceProviderController.verifyServiceProvider);
router.get('/signIn', serviceProviderController.signInServicreProvider);
router.post('/addAddress', verifyServiceProvider, serviceProviderController.addServiceProviderAddress);
router.post('/addDetail', verifyServiceProvider, serviceProviderController.addServiceProviderDetail);
router.patch('/addPersonalizeDetail', verifyServiceProvider, serviceProviderController.addServiceProviderPersonalizeDetail);
router.post('/addPicture', verifyServiceProvider,upload.any(), serviceProviderController.addServiceProviderPictures);
router.get('/allDetail', verifyServiceProvider, serviceProviderController.showAllDetails);

// -------------------- services ----------------- 
router.post('/createCustomServices', verifyServiceProvider, serviceProviderController.createCustomService);
router.delete('/deleteCustomServices', verifyServiceProvider, serviceProviderController.deleteCustomService);
router.post('/setSchedule', verifyServiceProvider, serviceProviderController.setSchedule);



module.exports = router;