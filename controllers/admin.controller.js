const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  teacherTbl,
  studentTbl,
  noticeTbl,
  weeklyReportTbl,
  userTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const bcrypt = require('bcrypt')

const generateBcryptSalt = async () => {
    const saltRounds = 10 // Number of rounds for salt generation
    const salt = await bcrypt.genSalt(saltRounds)
    return salt
  }
  
const adminController = {}

adminController.getMyProfile = async function (req, res) {
  try {
    const userTblObj = await userTbl.findByPk(req.uid);
    const totalTeacher = await teacherTbl.count();
    const totalStudent = await studentTbl.count();
    if (userTblObj) {
      res.status(200).json({
        userName: userTblObj.userName,
        personName: userTblObj.personName,
        mobile: userTblObj.mobile,
        email: userTblObj.email,
        totalTeacher,
        totalStudent
      })
    } else res.status(404).send('unable to get record')
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getMyProfile')
  }
}


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
          { name: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
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
          { name: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
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
adminController.getTableStudent = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const customerTblResult = await studentTbl.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
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
            teacherName: obj.get('teacherName'),
            batchName: obj.get('batchName'),
            rollNo: obj.get('rollNo'),
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
    const totalRecords = await studentTbl.count({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
        ]
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getTableStudent')
  }
}

adminController.addStudent = async function (req, res) {
    try {
      const { name, mobile, rollNo, batchName, otherNumber, email, address, password, teacherName, teacherId } = req.body;
      const salt = await generateBcryptSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      await studentTbl
        .create({
          name,
          mobile,
          otherNumber,
          email,
          address,
          batchName,
          teacherName,
          rollNo,
          password: hashedPassword,
          status: 1,
          userIdFk : req.uid,
          teacherIdFk: teacherId
        })
        .then((obj) => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.addStudent')
        })
    } catch (err) {
      handleSequelizeError(err, res, 'adminController.addStudent')
    }
}

adminController.updateStudent = async function (req, res) {
  try {
    const { id, name, mobile, otherNumber, email, address, rollNo, batchName, password, teacherName, teacherId } = req.body
    if (password) {
        const salt = await generateBcryptSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        await studentTbl.update({
            name,
            mobile,
            otherNumber,
            email,
            address,
            rollNo, batchName,
            password: hashedPassword,
            userIdFk : req.uid,
            teacherName,
            teacherIdFk: teacherId
        }, {
          where: {
            id
          }
        })
        .then(() => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.updateStudent')
        })
      } else {
        await studentTbl.update({
            name,
            mobile,
            otherNumber,
            email,
            address,
            rollNo, batchName,
            userIdFk : req.uid,
            teacherName,
            teacherIdFk: teacherId
        }, {
          where: {
            id
          }
        })
        .then(() => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.updateStudent')
        })
      }
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.updateStudent')
  }
}

adminController.changeStatusStudent = async function (req, res) {
  try {
    const { id, statusValue } = req.body
    await studentTbl.update({ status: statusValue }, { where: { id } })
      .then(() => {
        res.status(200).send('Data updated successfully')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'adminController.changeStatusStudent')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.changeStatusStudent')
  }
}

adminController.getAllTeacherName = async function (req, res) {
  try {
    const materialStdTblResults = await teacherTbl.findAll({
      where: {
        status: 1
      },
      order: [['createdAt', 'desc']],
      limit: 50
    })
    const result = materialStdTblResults.map(obj => ({
      label: obj.name,
      value: obj.id,
    }))
      res.status(200).json(result)
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getAllTeacherName')
  }
}

adminController.getTeacherNameForSelect = async function (req, res) {
  try {
    const { word } = req.query
    const materialStdTblResults = await teacherTbl.findAll({
      where: {
        [Op.and]: [{ status: 1 }],
        [Op.or]: [{ name: { [Op.like]: '%' + word + '%' } }]
      },
      limit: 15
    })
    const result = materialStdTblResults.map(obj => ({
      label: obj.name,
      value: obj.id,
    }))
    res.status(200).json(result)
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getTeacherNameForSelect')
  }
}

// api for notice
adminController.getTableNotice = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const customerTblResult = await noticeTbl.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%' + searchValue + '%' } },
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
        ]
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getTableNotice')
  }
}

adminController.addNotice = async function (req, res) {
    try {
      const { title, description, type } = req.body;
      await noticeTbl
        .create({
          title, description, type,
          status: 1,
          userIdFk : req.uid
        })
        .then((obj) => {
          res.status(201).send('saved to database')
        })
        .catch((err) => {
          handleSequelizeError(err, res, 'adminController.addNotice')
        })
    } catch (err) {
      handleSequelizeError(err, res, 'adminController.addNotice')
    }
}

adminController.updateNotice = async function (req, res) {
  try {
    const { id, title, description, type } = req.body
    await noticeTbl.update({
      title, description, type,
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
    handleSequelizeError(err, res, 'adminController.updateNotice')
  })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.updateNotice')
  }
}

adminController.changeStatusNotice = async function (req, res) {
  try {
    const { id, statusValue } = req.body
    await noticeTbl.update({ status: statusValue }, { where: { id } })
      .then(() => {
        res.status(200).send('Data updated successfully')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'adminController.changeStatusNotice')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.changeStatusNotice')
  }
}

// report
adminController.getTableReport = async function (req, res) {
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
          studentName: obj.get('studentName'),
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
        ]
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'adminController.getTableReport')
  }
}
module.exports = adminController
