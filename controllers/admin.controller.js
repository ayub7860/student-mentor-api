const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  customerTbl,
  branchTbl,
  staffTbl,
  productTbl,
  teacherTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const bcrypt = require('bcrypt')

const generateBcryptSalt = async () => {
    const saltRounds = 10 // Number of rounds for salt generation
    const salt = await bcrypt.genSalt(saltRounds)
    return salt
  }
  
const adminController = {}

// api for teacher 
adminController.getTableTeacher = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const customerTblResult = await teacherTbl.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchValue + '%' } }
        ]
      },
      order: [['createdAt', 'desc']],
      offset: start,
      limit: perPage
    })
    start++
    const tableData = customerTblResult.map((obj, index) => {
        return {
            srno: start++,
            id: obj.get('id'),
            name: obj.get('name'),
            mobile: obj.get('mobile'),
            email: obj.get('email'),
            otherNumber: obj.get('otherNumber'),
            address: obj.get('address'),   
            pincode: obj.get('pincode'),   
            city: obj.get('city'),   
            status: obj.get('status'),
            createdAt: obj.get('createdAt'),
            updatedAt: obj.get('updatedAt')
        }
    })
    const totalRecords = await teacherTbl.count({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchValue + '%' } }
        ]
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getTableTeacher')
  }
}

adminController.addTeacher = async function (req, res) {
    try {
      const { name, mobile, otherNumber, email, address, pincode, city, password } = req.body;
      const salt = await generateBcryptSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      await teacherTbl
        .create({
          name,
          mobile,
          otherNumber,
          email,
          address,
          pincode,
          city,
          password: hashedPassword,
          status: 1,
          userIdFk : req.uid
        })
        .then((obj) => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.addTeacher')
        })
    } catch (err) {
      handleSequelizeError(err, res, 'adminController.addTeacher')
    }
  }

adminController.updateTeacher = async function (req, res) {
  try {
    const { id, name, mobile, otherNumber, email, address, pincode, city, password } = req.body
    if (password) {
        const salt = await generateBcryptSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        await teacherTbl.update({
            name,
            mobile,
            otherNumber,
            email,
            address,
            pincode,
            city,
            password: hashedPassword,
            userIdFk : req.uid,
        }, {
          where: {
            id
          }
        })
        .then(() => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.updateTeacher')
        })
      } else {
        await teacherTbl.update({
            name,
            mobile,
            otherNumber,
            email,
            address,
            pincode,
            city,
            userIdFk : req.uid
        }, {
          where: {
            id
          }
        })
        .then(() => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.updateTeacher')
        })
      }
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.updateTeacher')
  }
}

adminController.changeStatusTeacher = async function (req, res) {
  try {
    const { id, statusValue } = req.body
    await teacherTbl.update({ status: statusValue }, { where: { id } })
      .then(() => {
        res.status(200).send('Data updated successfully')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'adminController.changeStatusTeacher')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.changeStatusTeacher')
  }
}

// api for student

module.exports = adminController
