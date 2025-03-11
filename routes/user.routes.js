const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route('/getTableUserMaster')
  .post(userController.getTableUserMaster)

router.route('/getCSVTableUser')
  .post(userController.getCSVTableUser)

router.route('/changeStatusUser')
  .post(userController.changeStatusUser)

router.route('/addUser')
  .post(userController.addUser)

router.route('/updateUser')
  .post(userController.updateUser)

router.route('/uploadDocuments')
  .post(userController.uploadDocuments)

router.route('/downloadDocument')
  .get(userController.downloadDocument)

module.exports = router
