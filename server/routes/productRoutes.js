const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);

// Protected routes
router.post('/', auth, upload.single('image'), productController.createProduct);
router.put('/:id', auth, upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
