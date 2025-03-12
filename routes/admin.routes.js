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


module.exports = router
