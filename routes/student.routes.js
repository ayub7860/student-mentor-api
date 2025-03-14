const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')


// notice routes
router.post('/getTableNotice', studentController.getTableNotice)



module.exports = router
