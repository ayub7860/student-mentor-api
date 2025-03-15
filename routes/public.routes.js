const express = require('express')
const router = express.Router()
const publicController = require('../controllers/public.controller')

router.post('/verifyUsername', publicController.verifyUsername)
router.post('/verifyPassword', publicController.verifyPassword)


router.route('/uploadDocuments')
  .post(publicController.uploadDocuments)

router.route('/downloadDocument')
  .get(publicController.downloadDocument)

router.get('/logoutAdmin', publicController.logoutAdmin)
router.get('/logoutBranch', publicController.logoutBranch)
router.get('/logoutStaff', publicController.logoutStaff)

module.exports = router
