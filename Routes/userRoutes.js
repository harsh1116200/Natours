const express = require('express');
const usercontroller = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();

router.post('/signup', authController.signup);
//130
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//135
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
//138

//Protect all the routes after this middleware -165
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
//139
router.get('/me', usercontroller.getMe, usercontroller.getUser);
router.patch(
  '/updateMe',
  usercontroller.uploadUserPhoto,
  usercontroller.resizeUserPhoto,
  usercontroller.updateMe
);
router.delete('/deleteMe', usercontroller.deleteMe); //140

//To only allow admins to perform the action after this middleware
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usercontroller.getAllUsers)
  .post(usercontroller.createUsers);
router
  .route('/:id')
  .get(usercontroller.getUser)
  .patch(usercontroller.UpdateUser)
  .delete(usercontroller.deleteUser);

module.exports = router;
