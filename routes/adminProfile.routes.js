const express = require('express')
const router = express.Router()
const profileController = require('../controllers/adminProfile.controller')

router.route('/getMyProfile')
  .get(profileController.getMyProfile)

router.route('/updateMyPassword')
  .post(profileController.updateMyPassword)

router.route('/userTracking')
  .post(profileController.userTracking)

module.exports = router
