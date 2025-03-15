const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')


// notice routes
router.post('/getTableNotice', studentController.getTableNotice)

router.post('/updateCompanyProfile', studentController.updateCompanyProfile)
router.get('/getMyProfile', studentController.getMyProfile)



module.exports = router
