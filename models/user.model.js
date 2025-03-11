'use strict'
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  // noinspection JSUnresolvedFunction,JSUnresolvedVariable
  const userTbl = sequelize.define(
    'tbl_user',
    {
      id: {
        field: 'user_id_pk',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Auto generated key'
      },
      userName: {
        field: 'user_name',
        type: DataTypes.STRING(75),
        comment: 'user name'
      },      
      mobile: {
        field: 'mobile',
        type: DataTypes.STRING(13),
        unique: true,
        comment: 'mobile'
      },
      password: {
        field: 'password',
        type: DataTypes.STRING(255),
        comment: 'password'
      },
      personName: {
        field: 'person_name',
        type: DataTypes.STRING(150),
        comment: 'person name'
      },      
      email: {
        field: 'email',
        type: DataTypes.STRING(50),
        comment: 'email'
      },
      image: {
        field: 'image',
        type: DataTypes.STRING(15),
        comment: 'image'
      },
      otp: {
        field: 'otp',
        type: DataTypes.STRING(6),
        comment: 'otp'
      },
      otpExpiryDateTime: {
        field: 'otp_expiry_date_time',
        type: DataTypes.DATE,
        comment: 'otp expiry date and time'
      },
      status: {
        field: 'status',
        type: DataTypes.TINYINT,
        defaultValue: 0,
        comment: '1 for active, 2 for inactive'
      }
    },
    {}
  )
  // noinspection JSUnusedLocalSymbols
  userTbl.associate = function (models) {}
  userTbl.isCorrectPassword = async function (id, password, callback) {
    await userTbl
      .findOne({ where: { id } })
      .then((userObj) => {
        bcrypt.compare(password, userObj.password, function (err, same) {
          if (err) {
            callback(err)
          } else {
            callback(err, same)
          }
        })
      })
      .catch((err) => {
        callback(err)
      })
  }
  return userTbl
}
