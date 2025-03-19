const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacher.controller')

// student routes
router.post('/getTableStudent', teacherController.getTableStudent)
router.post('/addStudent', teacherController.addStudent)
router.post('/changeStatusStudent', teacherController.changeStatusStudent)
router.post('/updateStudent', teacherController.updateStudent)
router.post('/approvedStatus', teacherController.approvedStatus)

// notice routes
router.post('/getTableNotice', teacherController.getTableNotice)

//report
router.post('/getTableReport', teacherController.getTableReport)
router.post('/approveStudentReport', teacherController.approveStudentReport)



module.exports = router
