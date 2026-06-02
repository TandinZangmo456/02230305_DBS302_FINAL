const express = require('express');

const router = express.Router();

const {
  getVisits
} = require('../controllers/visitsController');

router.get('/:productId', getVisits);

module.exports = router;
