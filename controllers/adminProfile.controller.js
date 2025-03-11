const { where } = require('sequelize')
const {
  userTbl,
  userTrackingTbl,
  branchTbl,
  staffTbl,
  customerTbl,
  customerProductTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const bcrypt = require('bcrypt')

const generateBcryptSalt = async () => {
  const saltRounds = 10 // Number of rounds for salt generation
  const salt = await bcrypt.genSalt(saltRounds)
  return salt
}

const profileController = {}

profileController.getMyProfile = async function (req, res) {
  try {
    const userTblObj = await userTbl.findByPk(req.uid);
    const totalBranch = await branchTbl.count();
    const totalBranchActive = await branchTbl.count({where: {status : 1}});
    const totalStaff = await staffTbl.count();
    const totalStaffActive = await staffTbl.count({where: {status : 1}});
    const totalCustomer = await customerTbl.count();
    const totalCustomerActive = await customerTbl.count({where: {status : 1}});
    const totalAccount = await customerProductTbl.count();
    const totalAccountActive = await customerProductTbl.count({where: {status : 1}});
    const totalAccountClose = await customerProductTbl.count({where: {status : 3}});
    if (userTblObj) {
      res.status(200).json({
        userName: userTblObj.userName,
        personName: userTblObj.personName,
        mobile: userTblObj.mobile,
        email: userTblObj.email,
        totalBranch,
        totalBranchActive,
        totalStaff,
        totalStaffActive,
        totalCustomer,
        totalCustomerActive,
        totalAccount,
        totalAccountActive,
        totalAccountClose,
      })
    } else res.status(404).send('unable to get record')
  } catch (err) {
    handleSequelizeError(err, res, 'profileController.getMyProfile')
  }
}

profileController.updateMyPassword = async function (req, res) {
  try {
    const { password, newPassword } = req.body
    const salt = await generateBcryptSalt()
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    await userTbl.isCorrectPassword(req.uid, password, (err, same) => {
      if (err) {
        res.status(500).json({ error: 'Existing password is incorrect.' })
      } else {
        if (same) {
          try {
            userTbl.update(
              {
                password: hashedPassword
              },
              {
                where: {
                  id: req.uid
                }
              }
            )
            res.status(200).json({ message: 'Password updated successfully.' })
          } catch (err) {
            handleSequelizeError(err, res, 'profileController.updateMyPassword')
          }
        } else {
          res.status(500).json({ error: 'Existing password is incorrect.' })
        }
      }
    })
  } catch (err) {
    handleSequelizeError(err, res, 'profileController.updateMyPassword')
  }
}

profileController.userTracking = async function (req, res) {
  try {
    const {
      name,
      pathToModule,
      details,
      fileName
    } = req.body

    await userTrackingTbl.create({
      name,
      pathToModule,
      details,
      fileName,
      userIdFk: req.uid
    })
      .then((obj) => {
        res.status(201).send('saved to database')
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'profileController.userTracking')
      })
  } catch (err) {
    handleSequelizeError(err, res, 'profileController.userTracking')
  }
}

module.exports = profileController
