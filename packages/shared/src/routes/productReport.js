const express = require('express');
const productReportController = require('../controllers/productReportController');

const router = express.Router();

router.get('/', productReportController.generateProductReport.bind(productReportController));

module.exports = router;
