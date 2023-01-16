const router = require('express').Router();
const serviceProviderController = require('../controller/serviceProviderController');
const upload = require('../middleware/multer');

router.post('/sign-up',upload.any(), serviceProviderController.signUpServiceProvider);

module.exports = router