const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.get('/:product_slug', ratingController.getRatingsByProduct);
router.post('/', ratingController.submitRating);

module.exports = router;
