const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  userTbl,
  websiteConfigTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const bcrypt = require('bcrypt')
const { PUBLIC_SIGNATURE_DOCUMENT_PATH } = require('../config')
const crypto = require('crypto')
const path = require('path')
const multer = require('multer')
const wlogger = require('../logger')

const generateBcryptSalt = async () => {
  const saltRounds = 10 // Number of rounds for salt generation
  const salt = await bcrypt.genSalt(saltRounds)
  return salt
}

const userController = {}

const storageOptions = {
  destination: function (req, file, cb) {
    cb(null, PUBLIC_SIGNATURE_DOCUMENT_PATH)
  },
  filename: async function (req, file, cb) {
    try {
      const detailsObj = await websiteConfigTbl.findByPk(1)
      const srno = detailsObj.documentUploadCounter
      await detailsObj.update({ documentUploadCounter: srno + 1 })
      const uniqueId = crypto.randomBytes(3).toString('hex')
      const filename = uniqueId + srno + path.extname(file.originalname)
      cb(null, filename)
    } catch (error) {
      cb(error)
    }
  }
}

const fileFilter = function (req, file, cb) {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.JPG', '.JPEG', '.PDF', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.svg']
  const ext = path.extname(file.originalname)
  if (allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid files'))
  }
}

const limits = {
  fileSize: 1024 * 1024 * 15
}

const documentUpload = multer({
  storage: multer.diskStorage(storageOptions),
  fileFilter,
  limits
}).single('file')

userController.uploadDocuments = async function (req, res) {
  try {
    documentUpload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File size exceeds the limit' })
        else handleSequelizeError(err, res, 'userController.uploadDocuments')
      } else if (req.file && req.file.filename) {
        res.status(200).json({ fname: req.file.filename })
      } else handleSequelizeError(new Error('No files were uploaded'), res, 'userController.uploadDocuments')
    })
  } catch (err) {
    if (err.message === 'Invalid files') return res.status(415).json({ error: 'Invalid files' })
    else handleSequelizeError(err, res, 'userController.uploadDocuments')
  }
}

userController.downloadDocument = async function (req, res) {
  try {
    const options = {
      root: path.join(__dirname, '../public/signature'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    const fileName = req.query.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        wlogger.error('userController.downloadDocument: Error: ' + err)
      }
    })
  } catch (err) {
    handleSequelizeError(err, res, 'userController.downloadDocument')
  }
}

userController.getTableUserMaster = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords
    const userTblResult = await userTbl.findAll({
      where: {
        [Op.or]: [
          { userName: { [Op.like]: '%' + searchValue + '%' } },
          { personName: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
        ]
      },
      order: [[orderBy, orderDirection]],
      offset: start,
      limit: perPage
    })
    start++
    const tableData = userTblResult.map((obj, index) => {
      return {
        srno: start++,
        id: obj.get('id'),
        userName: obj.get('userName'),
        personName: obj.get('personName'),
        mobile: obj.get('mobile'),
        email: obj.get('email'),
        image: obj.get('signature'),
        status: obj.get('status'),
        createdAt: obj.get('createdAt'),
        updatedAt: obj.get('updatedAt')
      }
    })

    const totalRecords = await userTbl.count({
      where: {
        [Op.or]: [
          { userName: { [Op.like]: '%' + searchValue + '%' } },
          { personName: { [Op.like]: '%' + searchValue + '%' } },
          { mobile: { [Op.like]: '%' + searchValue + '%' } },
          { email: { [Op.like]: '%' + searchValue + '%' } }
        ]
      }
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'userController.getTableUserMaster')
  }
}

userController.changeStatusUser = async function (req, res) {
  try {
    const { id, statusValue } = req.body
    await userTbl.update({ status: statusValue }, { where: { id } })
      .then(() => {
        res.status(200).send('Data updated successfully')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'userController.changeStatusUser')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'userController.changeStatusUser')
  }
}

userController.addUser = async function (req, res) {
  try {
    const {
      userName,
      password,
      personName,
      mobile,
      email,
      image
    } = req.body
    const salt = await generateBcryptSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    await userTbl
      .create({
        userName,
        password: hashedPassword,
        personName,
        mobile,
        email,
        image: image,
        status: 1
      })
      .then((obj) => {
        res.status(201).send('saved to database')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'userController.addUser')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'userController.addUser')
  }
}

userController.updateUser = async function (req, res) {
  try {
    const {
      id,
      userName,
      password,
      personName,
      mobile,
      email,
      image
    } = req.body
    if (password) {
      const salt = await generateBcryptSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      await userTbl.update({
        userName,
        password: hashedPassword,
        personName,
        mobile,
        email,
        image: image
      }, {
        where: {
          id
        }
      })
      .then(() => {
        res.status(201).send('saved to database')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'userController.updateUser')
      })
    } else {
      await userTbl.update({
        userName,
        personName,
        mobile,
        email,
        image: image
      }, {
        where: {
          id
        }
      })
      .then(() => {
        res.status(201).send('saved to database')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'userController.updateUser')
      })
    }
  } catch (err) {
    handleSequelizeError(err, res, 'userController.updateUser')
  }
}

userController.getCSVTableUser = async function (req, res) {
  try {
    const userTblResult = await userTbl.findAll({
      where: {},
      order: [['createdAt', 'desc']]
    })
    let start = 1
    const tableData = []

    userTblResult.forEach((obj) => {
      const DTobj = {
        srno: start++,
        id: obj.id,
        userName: obj.userName,
        personName: obj.personName,
        mobile: obj.mobile,
        email: obj.email,
        status: obj.status,
        updatedAt: obj.updatedAt,
        createdAt: obj.createdAt
      }
      tableData.push(DTobj)
    })
    res.status(200).json({ tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'userController.getCSVTableUser')
  }
}

module.exports = userController
