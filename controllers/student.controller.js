const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  teacherTbl,
  studentTbl,
  noticeTbl,
  weeklyReportTbl
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
    const noticeTblObj = await noticeTbl.findAll({
      where: {
        type: { [Op.in]: [2, 3] }, // Fetch only type 2 or 3
        status: 1
      },
      limit: 1,
      order: [[ 'updatedAt', 'ASC']]
    });
    if (studentTblObj) {
      res.status(200).json({ studentTblObj, noticeTblObj})
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

// api for weekly report 
studentController.getTableWeeklyReport = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const customerTblResult = await weeklyReportTbl.findAll({
      where: {
        [Op.or]: [
          { task: { [Op.like]: '%' + searchValue + '%' } },
        ],
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
            task: obj.get('task'),
            description: obj.get('description'),
            fromDate: obj.get('fromDate'),
            toDate: obj.get('toDate'),
            teacherName: obj.get('teacherName'),
            isApprovedByTeacher: obj.get('isApprovedByTeacher'),
            status: obj.get('status'),
            createdAt: obj.get('createdAt'),
            updatedAt: obj.get('updatedAt')
        }
    })
    const totalRecords = await weeklyReportTbl.count({
      where: {
        [Op.or]: [
          { task: { [Op.like]: '%' + searchValue + '%' } },
        ],
        status: 1
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'studentController.getTableWeeklyReport')
  }
}

studentController.addWeeklyReport = async function (req, res) {
  try {
    const { fromDate, toDate, description, task } = req.body;
    const studentData = await studentTbl.findByPk(req.uid);
    const teacherData = await teacherTbl.findByPk(studentData.teacherIdFk);
    await weeklyReportTbl
      .create({
        fromDate, toDate, description, task,
        status: 1,
        teacherIdFk: studentData.teacherIdFk,
        studentName: studentData.name,
        teacherName: teacherData.name,
        studentIdFk : req.uid,
        isApprovedByTeacher: 3
      })
      .then((obj) => {
        res.status(201).send('saved to database')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'studentController.addWeeklyReport')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'studentController.addWeeklyReport')
  }
}

studentController.updateWeeklyReport = async function (req, res) {
try {
  const { id, fromDate, toDate, description, task  } = req.body
  await weeklyReportTbl.update({
    fromDate, toDate, description, task ,
  }, {
    where: {
      id
    }
  })
  .then(() => {
    res.status(201).send('saved to database')
  })
  .catch((err) => {
    handleSequelizeError(err, res, 'studentController.updateWeeklyReport')
  })
} catch (err) {
  handleSequelizeError(err, res, 'studentController.updateWeeklyReport')
}
}


module.exports = studentController
