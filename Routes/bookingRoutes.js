const express = require('express');
const bookingController = require('../controller/bookingController');
const router = express.Router();
const authController = require('../controller/authController');

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);
module.exports = router;
