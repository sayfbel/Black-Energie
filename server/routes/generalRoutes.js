const express = require('express');
const router = express.Router();
const generalController = require('../controllers/generalController');
const seedController = require('../scripts/seedController');
const auth = require('../middlewares/auth');

router.get('/', generalController.healthCheck);
router.post('/contact', generalController.contact);
router.get('/seed', auth, seedController.seedDatabase);
router.get('/delivery-costs', generalController.getDeliveryCosts);

module.exports = router;
