const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const auth = require('../middlewares/auth');

// Offers
router.post('/offers', auth, marketingController.createOffer);
router.get('/offers', marketingController.getOffers);
router.delete('/offers/:id', auth, marketingController.deleteOffer);

// Coupons
router.post('/coupons', auth, marketingController.createCoupon);
router.get('/coupons', auth, marketingController.getCoupons);
router.post('/coupons/validate', marketingController.validateCoupon);
router.delete('/coupons/:id', auth, marketingController.deleteCoupon);

module.exports = router;
