const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

/// teacher routes
router.post('/getTableTeacher', adminController.getTableTeacher)
router.post('/addTeacher', adminController.addTeacher)
router.post('/changeStatusTeacher', adminController.changeStatusTeacher)
router.post('/updateTeacher', adminController.updateTeacher)

// student routes
router.post('/getTableStudent', adminController.getTableStudent)
router.post('/addStudent', adminController.addStudent)
router.post('/changeStatusStudent', adminController.changeStatusStudent)
router.post('/updateStudent', adminController.updateStudent)
router.get('/getAllTeacherName', adminController.getAllTeacherName)
router.get('/getTeacherNameForSelect', adminController.getTeacherNameForSelect)

// notice routes
router.post('/getTableNotice', adminController.getTableNotice)
router.post('/addNotice', adminController.addNotice)
router.post('/changeStatusNotice', adminController.changeStatusNotice)
router.post('/updateNotice', adminController.updateNotice)


module.exports = router
