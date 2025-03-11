const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/admin.controller')

router.post('/getTableTeacher', teacherController.getTableTeacher)
router.post('/addTeacher', teacherController.addTeacher)
router.post('/changeStatusTeacher', teacherController.changeStatusTeacher)
router.post('/updateTeacher', teacherController.updateTeacher)

module.exports = router
