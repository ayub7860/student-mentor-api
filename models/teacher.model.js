
'use strict';
const bcrypt = require('bcrypt')
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const teacherTbl = sequelize.define(
        'tbl_teacher',
        {
            id: {
                field: 'teacher_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            name: {
                field: 'name',
                type: DataTypes.STRING(100),
                comment: 'name'
            },
            mobile: {
                field: 'mobile',
                type: DataTypes.STRING(12),
                comment: 'mobile number'
            },
            otherNumber: {
                field: 'other_number',
                type: DataTypes.STRING(50),
                comment: 'other number'
            },
            email: {
                field: 'email',
                type: DataTypes.STRING(50),
                comment: 'email'
              },
            address: {
                field: 'address',
                type: DataTypes.TEXT,
                comment: 'address'
            },
            pincode: {
                field: 'pincode',
                type: DataTypes.STRING(6),
                comment: 'pincode'
            },
            city: {
                field: 'city',
                type: DataTypes.STRING(50),
                comment: 'city'
            },            
            password: {
                field: 'password',
                type: DataTypes.STRING(255),
                comment: 'password'
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
            image: {
                field: 'image',
                type: DataTypes.STRING(15),
                comment: 'image'
            },
            status: {
                field: 'status',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: 'status'
            },           
            userIdFk:{
                field: 'user_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_user',
                    key: 'user_id_pk'
                },
                comment: 'user table foreign key'
            },
        },
        {}
    );
      // noinspection JSUnusedLocalSymbols
    teacherTbl.associate = function (models) {}
    teacherTbl.isCorrectPassword = async function (id, password, callback) {
        await teacherTbl
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
    return teacherTbl
}
