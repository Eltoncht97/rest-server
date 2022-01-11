const { Router } = require('express');
const { search, searchProductsByCategory } = require('../controllers/search');

const router = Router();

router.get('/:collection/:term', search)

router.get('/category/:category/products', searchProductsByCategory)

module.exports = router;