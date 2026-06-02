const express = require('express');

const router = express.Router();

const {
 totalSales,
 topProducts,
 dailyRevenue
} = require('../controllers/analyticsController');

router.get('/sales', totalSales);
router.get('/top-products', topProducts);
router.get('/daily-revenue', dailyRevenue);

module.exports = router;
