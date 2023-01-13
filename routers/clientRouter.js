const express = require('express');
const router = express.Router();
const clientController = require('../controller/clientDetailController');
const upload = require('../middleware/multer')

router.post('/signUp_client', upload.any(), clientController.signUpClient);
router.post('/add-client-address', clientController.addClientAddress);
router.patch('/clientAcc-verification', clientController.clientAccountVerification);
router.get('/signIn_client', clientController.signInClient);
router.get('/show-client-address', clientController.showClientAddress);

module.exports = router;