const express = require('express');
const router = express.Router();
const clientController = require('../controller/clientDetailController');
const upload = require('../middleware/multer')
const {verify}= require('../middleware/authClient')

// client signIn and SignUp --------------------
router.post('/signUp', upload.any(), clientController.signUpClient);
router.post('/addAddress', clientController.addClientAddress);
router.patch('/sendOtp', clientController.sendOtpclient);
router.patch('/accVerification', clientController.clientAccountVerification);
router.get('/signIn', clientController.signInClient);
router.get('/showAddress',verify, clientController.showClientAddress);
router.delete('/removeAddress',verify, clientController.removeClientAddress);

module.exports = router;