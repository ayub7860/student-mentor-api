const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')

router.post('/getTableNotice', studentController.getTableNotice)
router.post('/updateCompanyProfile', studentController.updateCompanyProfile)
router.get('/getMyProfile', studentController.getMyProfile)
router.post('/getTableWeeklyReport', studentController.getTableWeeklyReport)
router.post('/addWeeklyReport', studentController.addWeeklyReport)
router.post('/updateWeeklyReport', studentController.updateWeeklyReport)
router.post('/updateMyPassword', studentController.updateMyPassword)

module.exports = router
