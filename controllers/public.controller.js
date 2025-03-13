const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  userTbl, userTrackingTbl, branchManagerTbl, branchEmployeeTbl, coOpSocietyTbl, channelPartnerTbl, employeeTbl, soundBoxRequestTbl,
  webHookResponseTbl, websiteConfigTbl, contactUsTbl,
  branchTbl,
  staffTbl,
  teacherTbl,
  studentTbl
} = require('../sequelize')
const jwt = require('jsonwebtoken')
const path = require('path')
const otpGenerator = require('../lib/otpGenerator')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const wlogger = require('../logger')
const { handleSequelizeError } = require('../sequelizeErrorHandler')
const {
  SECRET_KEY_ADMIN,
  NODE_ENV,
  COOKIE_DOMAIN_API,
  TXTLCL_API_KEY,
  TXTLCL_SENDER,
  SECRET_KEY_SUB_MERCHANT, MERCHANT_KEY, MERCHANT_SALT,
  SECRET_KEY_STAFF,
  SECRET_KEY_BRANCH,
  SECRET_KEY_STUDENT,
  SECRET_KEY_TEACHER
} = require('../config')
const axios = require('axios')
const sha512 = require('js-sha512')
const tlClient = axios.create({
  baseURL: 'https://api.textlocal.in/',
  params: {
    apiKey: TXTLCL_API_KEY,
    sender: TXTLCL_SENDER
  }
})

const publicController = {}

publicController.downloadKycDocument = async function (req, res) {
  try {
    const options = {
      root: path.join(__dirname, '../public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    const fileName = req.query.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        wlogger.error('publicController.downloadKycDocument: Error: ' + err)
      }
    })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.downloadKycDocument')
  }
}

publicController.sendOtpToAdmin = async function (req, res) {
  const { mobile } = req.body
  try {
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })
    const adminTblObj = await userTbl.findOne({ where: { mobile, status: 1 } })
    if (adminTblObj) {
      adminTblObj.update({
        otp,
        otpExpiryDateTime: Date.now() + 900 * 1000
      })
      const params = new URLSearchParams()
      params.append('numbers', [parseInt('91' + mobile)])

      const newUserName = 'User'
      //       params.append(
      //         'message', `Dear ${newUserName},
      // Thanks for your enquiry for ${otp},
      // Our team will contact you soon,
      // Call 9423607843/9518593701, Soft The Next`
      //       )

      // params.append(
      //   'message', `Your OTP is: ${otp} @ www.stnshops.com - STNSHOPS`
      // )

      params.append(
        'message', `Do not share your login OTP with anyone.${otp} OTP to accessing your Account. Please report unauthorised access to customer care. Powered by ADVITA CREDIT INFO PVT LTD`
      )

      tlClient.post('/send', params).then(() => {
        res.json({ code: 200, message: 'OTP Send' })
      })
        .catch((err) => {
          handleSequelizeError(err, res, 'publicController.sendOtpToAdmin')
        })
    } else res.json({ code: 210, message: 'Invalid mobile number' })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.sendOtpToAdmin')
  }
}

publicController.verifyUsername = async function (req, res) {
  const { mobile } = req.body
  try {
    const adminTblObj = await userTbl.findOne({
      where: {
        [Op.or]: [
          { mobile },
          { userName: mobile }
        ],
        status: 1
      }
    })
    const branchTblObj = await branchTbl.findOne({
      where: {
        [Op.or]: [
          { mobile },
        ],
        status: 1
      }
    })
    const staffTblObj = await staffTbl.findOne({
      where: {
        [Op.or]: [
          { mobile },
        ],
        status: 1
      }
    })
    if (adminTblObj) {
      res.json({ code: 200, message: 'Username or mobile is valid, please enter password.' })
    } else if(branchTblObj){
      res.json({ code: 200, message: 'Username or mobile is valid, please enter password.' })
    } else if(staffTblObj){
      res.json({ code: 200, message: 'Username or mobile is valid, please enter password.' })
    } else res.status(500).json({ error: 'Username or mobile is incorrect.' })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.verifyUsername')
  }
}

publicController.verifyOtpOfAdmin = async function (req, res) {
  const { mobile, otp } = req.body
  try {
    const adminTblObj = await userTbl.findOne({
      where: {
        mobile,
        otp,
        otpExpiryDateTime: { [Op.gt]: Date.now() },
        status: 1
      }
    })
    if (adminTblObj) {
      const payload = {
        uid: adminTblObj.id
      }
      if (NODE_ENV === 'development') {
        const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
          expiresIn: '8760h'
        })
        const cookieOptions = {
          maxAge: 31536000000,
          httpOnly: true
        }
        res.cookie('ussc_auth_token', token, cookieOptions).sendStatus(200)
      } else {
        const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
          expiresIn: '12h'
        })
        const cookieOptions = {
          maxAge: 43200000,
          httpOnly: true
        }
        cookieOptions.domain = COOKIE_DOMAIN_API
        cookieOptions.sameSite = 'none'
        cookieOptions.secure = true
        cookieOptions.path = '/'
        res.cookie('ussc_auth_token', token, cookieOptions).sendStatus(200)
      }
    } else res.json({ code: 210, message: 'Invalid otp' })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.verifyOtpOfAdmin')
  }
}

// publicController.verifyPassword = async function (req, res) {
//   const { mobile, otp } = req.body
//   try {
//     const adminTblObj = await userTbl.findOne({
//       where: {
//         [Op.or]: [
//           { mobile },
//           { userName: mobile }
//         ],
//         status: 1
//       }
//     })
//     if (adminTblObj) {
//       await userTbl.isCorrectPassword(adminTblObj.id, otp, (err, same) => {
//         if (err) {        
//           res.status(500).json({ error: 'Password is incorrect.' })
//         } else {
//           if (same) {            
//             const payload = {
//               uid: adminTblObj.id
//             }
//             if (NODE_ENV === 'development') {
//               const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
//                 expiresIn: '8760h'
//               })
//               const cookieOptions = {
//                 maxAge: 31536000000,
//                 httpOnly: true
//               }
//               res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
//             } else {
//               const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
//                 expiresIn: '12h'
//               })
//               const cookieOptions = {
//                 maxAge: 43200000,
//                 httpOnly: true
//               }
//               cookieOptions.domain = COOKIE_DOMAIN_API
//               cookieOptions.sameSite = 'none'
//               cookieOptions.secure = true
//               cookieOptions.path = '/'
//               res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
//             }
//           } else {
//             res.status(500).json({ error: 'Password is incorrect.' })
//           }
//         }
//       })
//     } else res.status(500).json({ error: 'Username or mobile is incorrect.' })
//   } catch (err) {
//     handleSequelizeError(err, res, 'publicController.verifyOtpOfAdmin')
//   }
// }

// publicController.verifyPassword = async function (req, res) {
//   const { mobile, otp } = req.body
//   try {
//     const adminTblObj = await userTbl.findOne({
//       where: {
//         [Op.or]: [
//           { mobile },
//         ],
//         status: 1
//       }
//     })
//     // const branchTblObj = await branchTbl.findOne({
//     //   where: {
//     //     [Op.or]: [
//     //       { mobile },
//     //     ],
//     //     status: 1
//     //   }
//     // })
//     // const staffTblObj = await staffTbl.findOne({
//     //   where: {
//     //     [Op.or]: [
//     //       { mobile },
//     //     ],
//     //     status: 1
//     //   }
//     // })
//     if (adminTblObj) {
//       await userTbl.isCorrectPassword(adminTblObj.id, otp, (err, same) => {
//         if (err) {        
//           res.status(500).json({ error: 'Password is incorrect.' })
//         } else {
//           if (same) {            
//             const payload = {
//               uid: adminTblObj.id
//             }
//             if (NODE_ENV === 'development') {
//               const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
//                 expiresIn: '8760h'
//               })
//               const cookieOptions = {
//                 maxAge: 31536000000,
//                 httpOnly: true
//               }
//               // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
//               res.cookie('admin_auth_token', token, cookieOptions).status(200).json({ type: 'admin' });
//             } else {
//               const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
//                 expiresIn: '8760h'
//               })
//               const cookieOptions = {
//                 maxAge: 43200000,
//                 httpOnly: true
//               }
//               cookieOptions.domain = COOKIE_DOMAIN_API
//               cookieOptions.sameSite = 'none'
//               cookieOptions.secure = true
//               cookieOptions.path = '/'
//               // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
//               res.cookie('admin_auth_token', token, cookieOptions).status(200).json({ type: 'admin' });
//             }
//           } else {
//             res.status(500).json({ error: 'Password is incorrect.' })
//           }
//         }
//       })
//     } 
//     // else if (branchTblObj) {
//     //   await branchTbl.isCorrectPassword(branchTblObj.id, otp, (err, same) => {
//     //     if (err) {        
//     //       res.status(500).json({ error: 'Password is incorrect.' })
//     //     } else {
//     //       if (same) {            
//     //         const payload = {
//     //           uid: branchTblObj.id
//     //         }
//     //         if (NODE_ENV === 'development') {
//     //           const token = jwt.sign(payload, SECRET_KEY_BRANCH, {
//     //             expiresIn: '8760h'
//     //           })
//     //           const cookieOptions = {
//     //             maxAge: 31536000000,
//     //             httpOnly: true
//     //           }
//     //           // res.cookie('branch_auth_token', token, cookieOptions).sendStatus(200)
//     //           res.cookie('branch_auth_token', token, cookieOptions).status(200).json({ type: 'branch' });
//     //         } else {
//     //           const token = jwt.sign(payload, SECRET_KEY_BRANCH, {
//     //             expiresIn: '8760h'
//     //           })
//     //           const cookieOptions = {
//     //             maxAge: 43200000,
//     //             httpOnly: true
//     //           }
//     //           cookieOptions.domain = COOKIE_DOMAIN_API
//     //           cookieOptions.sameSite = 'none'
//     //           cookieOptions.secure = true
//     //           cookieOptions.path = '/'
//     //           // res.cookie('branch_auth_token', token, cookieOptions).sendStatus(200)
//     //           res.cookie('branch_auth_token', token, cookieOptions).status(200).json({ type: 'branch' });
//     //         }
//     //       } else {
//     //         res.status(500).json({ error: 'Password is incorrect.' })
//     //       }
//     //     }
//     //   })
//     // } else if (staffTblObj) {
//     //   await staffTbl.isCorrectPassword(staffTblObj.id, otp, (err, same) => {
//     //     if (err) {        
//     //       res.status(500).json({ error: 'Password is incorrect.' })
//     //     } else {
//     //       if (same) {            
//     //         const payload = {
//     //           uid: staffTblObj.id
//     //         }
//     //         if (NODE_ENV === 'development') {
//     //           const token = jwt.sign(payload, SECRET_KEY_STAFF, {
//     //             expiresIn: '8760h'
//     //           })
//     //           const cookieOptions = {
//     //             maxAge: 31536000000,
//     //             httpOnly: true
//     //           }
//     //           // res.cookie('staff_auth_token', token, cookieOptions).sendStatus(200)
//     //           res.cookie('staff_auth_token', token, cookieOptions).status(200).json({ type: 'staff' });
//     //         } else {
//     //           const token = jwt.sign(payload, SECRET_KEY_STAFF, {
//     //             expiresIn: '8760h'
//     //           })
//     //           const cookieOptions = {
//     //             maxAge: 43200000,
//     //             httpOnly: true
//     //           }
//     //           cookieOptions.domain = COOKIE_DOMAIN_API
//     //           cookieOptions.sameSite = 'none'
//     //           cookieOptions.secure = true
//     //           cookieOptions.path = '/'
//     //           // res.cookie('staff_auth_token', token, cookieOptions).sendStatus(200)
//     //           res.cookie('staff_auth_token', token, cookieOptions).status(200).json({ type: 'staff' });
//     //         }
//     //       } else {
//     //         res.status(500).json({ error: 'Password is incorrect.' })
//     //       }
//     //     }
//     //   })
//     // } 
//     else res.status(500).json({ error: 'Username or mobile is incorrect.' })
//   } catch (err) {
//     handleSequelizeError(err, res, 'publicController.verifyOtpOfAdmin')
//   }
// }

publicController.logoutAdmin = async function (req, res) {
  const cookieOptions = {
    maxAge: 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? COOKIE_DOMAIN_API : undefined
  }
  // res.cookie('admin_auth_token', 'thoy', cookieOptions).sendStatus(200)

  res.cookie('admin_auth_token', '', cookieOptions);
  res.cookie('teacher_auth_token', '', cookieOptions);
  res.cookie('student_auth_token', '', cookieOptions);

  return res.status(200).json({ message: 'Logout successful' });
}

publicController.logoutBranch = async function (req, res) {
  const cookieOptions = {
    maxAge: 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? COOKIE_DOMAIN_API : undefined
  }
  res.cookie('branch_auth_token', 'thoy', cookieOptions).sendStatus(200)
}

publicController.logoutStaff = async function (req, res) {
  const cookieOptions = {
    maxAge: 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? COOKIE_DOMAIN_API : undefined
  }
  res.cookie('staff_auth_token', 'thoy', cookieOptions).sendStatus(200)
}

publicController.downloadDocument = async function (req, res) {
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
        wlogger.error('publicController.downloadDocument: Error: ' + err)
      }
    })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.downloadDocument')
  }
}


publicController.verifyPassword = async function (req, res) {
  const { mobile, otp, role } = req.body;
  console.log(' mobile, otp, role',  mobile, otp, role)
  try {
    if(role === 'admin'){
      const adminTblObj = await userTbl.findOne({
        where: {
          [Op.or]: [
            { mobile },
          ],
          status: 1
        }
      })
      if (adminTblObj) {
        await userTbl.isCorrectPassword(adminTblObj.id, otp, (err, same) => {
          if (err) {        
            res.status(500).json({ error: 'Password is incorrect.' })
          } else {
            if (same) {            
              const payload = {
                uid: adminTblObj.id
              }
              if (NODE_ENV === 'development') {
                const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 31536000000,
                  httpOnly: true
                }
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('admin_auth_token', token, cookieOptions).status(200).json({ type: 'admin' });
              } else {
                const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 43200000,
                  httpOnly: true
                }
                cookieOptions.domain = COOKIE_DOMAIN_API
                cookieOptions.sameSite = 'none'
                cookieOptions.secure = true
                cookieOptions.path = '/'
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('admin_auth_token', token, cookieOptions).status(200).json({ type: 'admin' });
              }
            } else {
              res.status(500).json({ error: 'Password is incorrect.' })
            }
          }
        })
      } else res.status(500).json({ error: 'Username or mobile is incorrect.' })
    } else if(role === 'teacher'){
      const teacherTblObj = await teacherTbl.findOne({
        where: {
          [Op.or]: [
            { mobile },
          ],
          status: 1
        }
      })
      if (teacherTblObj) {
        await teacherTbl.isCorrectPassword(teacherTblObj.id, otp, (err, same) => {
          if (err) {        
            res.status(500).json({ error: 'Password is incorrect.' })
          } else {
            if (same) {            
              const payload = {
                uid: teacherTblObj.id
              }
              if (NODE_ENV === 'development') {
                const token = jwt.sign(payload, SECRET_KEY_TEACHER, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 31536000000,
                  httpOnly: true
                }
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('teacher_auth_token', token, cookieOptions).status(200).json({ type: 'teacher' });
              } else {
                const token = jwt.sign(payload, SECRET_KEY_TEACHER, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 43200000,
                  httpOnly: true
                }
                cookieOptions.domain = COOKIE_DOMAIN_API
                cookieOptions.sameSite = 'none'
                cookieOptions.secure = true
                cookieOptions.path = '/'
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('teacher_auth_token', token, cookieOptions).status(200).json({ type: 'teacher' });
              }
            } else {
              res.status(500).json({ error: 'Password is incorrect.' })
            }
          }
        })
      } else res.status(500).json({ error: 'Username or mobile is incorrect.' })
    } else if(role === 'student'){
      const studentTblObj = await studentTbl.findOne({
        where: {
          [Op.or]: [
            { mobile },
          ],
          status: 1
        }
      })
      if (studentTblObj) {
        await studentTbl.isCorrectPassword(studentTblObj.id, otp, (err, same) => {
          if (err) {        
            res.status(500).json({ error: 'Password is incorrect.' })
          } else {
            if (same) {            
              const payload = {
                uid: studentTblObj.id
              }
              if (NODE_ENV === 'development') {
                const token = jwt.sign(payload, SECRET_KEY_STUDENT, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 31536000000,
                  httpOnly: true
                }
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('student_auth_token', token, cookieOptions).status(200).json({ type: 'student' });
              } else {
                const token = jwt.sign(payload, SECRET_KEY_STUDENT, {
                  expiresIn: '8760h'
                })
                const cookieOptions = {
                  maxAge: 43200000,
                  httpOnly: true
                }
                cookieOptions.domain = COOKIE_DOMAIN_API
                cookieOptions.sameSite = 'none'
                cookieOptions.secure = true
                cookieOptions.path = '/'
                // res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
                res.cookie('student_auth_token', token, cookieOptions).status(200).json({ type: 'student' });
              }
            } else {
              res.status(500).json({ error: 'Password is incorrect.' })
            }
          }
        })
      } else res.status(500).json({ error: 'Username or mobile is incorrect.' })
    }
    else res.status(500).json({ error: 'Username or mobile is incorrect.' })
  } catch (err) {
    handleSequelizeError(err, res, 'publicController.verifyOtpOfAdmin')
  }
}
module.exports = publicController
