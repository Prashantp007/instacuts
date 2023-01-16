const express = require('express');
const router = express.Router();
const clientController = require('../controller/clientDetailController');
const upload = require('../middleware/multer')
const {verify}= require('../middleware/authClient')

router.post('/sign_up', upload.any(), clientController.signUpClient);
router.post('/add-address', clientController.addClientAddress);
router.patch('/acc-verification', clientController.clientAccountVerification);
router.get('/sign_in', clientController.signInClient);
router.get('/show-address',verify, clientController.showClientAddress);
router.delete('/remove-address',verify, clientController.removeClientAddress);

module.exports = router;