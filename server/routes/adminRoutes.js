const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

router.post('/login', adminController.login);
router.post('/verify-otp', adminController.verifyOTP);
router.get('/stats', auth, adminController.getDashboardStats);
router.get('/product/:productName', auth, adminController.getProductStats);
router.get('/customer/:customerName', auth, adminController.getCustomerStats);

// Delivery Costs Routes
router.get('/delivery', auth, adminController.getDeliveryCosts);
router.post('/delivery', auth, adminController.addDeliveryCost);
router.put('/delivery/:id', auth, adminController.updateDeliveryCost);
router.delete('/delivery/:id', auth, adminController.deleteDeliveryCost);

module.exports = router;
