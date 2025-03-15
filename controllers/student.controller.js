const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  teacherTbl,
  studentTbl,
  noticeTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const bcrypt = require('bcrypt')

const generateBcryptSalt = async () => {
    const saltRounds = 10 // Number of rounds for salt generation
    const salt = await bcrypt.genSalt(saltRounds)
    return salt
  }
  
const studentController = {}

studentController.getMyProfile = async function (req, res) {
  try {
    const studentTblObj = await studentTbl.findByPk(req.uid);
    if (studentTblObj) {
      res.status(200).json(studentTblObj)
    } else res.status(404).send('unable to get record')
  } catch (err) {
    handleSequelizeError(err, res, 'studentController.getMyProfile')
  }
}

// api for notice
studentController.getTableNotice = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const customerTblResult = await noticeTbl.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%' + searchValue + '%' } },
        ],
        type: { [Op.in]: [2, 3] }, // Fetch only type 2 or 3
        status: 1
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
            title: obj.get('title'),
            description: obj.get('description'),
            type: obj.get('type'),
            status: obj.get('status'),
            createdAt: obj.get('createdAt'),
            updatedAt: obj.get('updatedAt')
        }
    })
    const totalRecords = await noticeTbl.count({
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%' + searchValue + '%' } },
        ],
        type: { [Op.in]: [2, 3] },
        status: 1
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'studentController.getTableNotice')
  }
}

// api for update company details
studentController.updateCompanyProfile = async function (req, res) {
    try {
      const { 
        companyName, companyLocation, projectName,
        projectDescription, joiningDate, endDate, internshipLetter, projectLetter
      } = req.body;
      
      await studentTbl
        .update({
          companyName, companyLocation, projectName,
          projectDescription, joiningDate, endDate, internshipLetter, projectLetter,
        },  {
          where: {
            id: req.uid
          }})
        .then((obj) => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'studentController.updateCompanyProfile')
        })
    } catch (err) {
      handleSequelizeError(err, res, 'studentController.updateCompanyProfile')
    }
}

module.exports = studentController
