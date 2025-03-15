
'use strict';
const bcrypt = require('bcrypt')
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const studentTbl = sequelize.define(
        'tbl_student',
        {
            id: {
                field: 'student_id_pk',
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
            rollNo: {
                field: 'roll_no',
                type: DataTypes.STRING(20),
                comment: 'rollNo'
            },
            batchName: {
                field: 'batch_name',
                type: DataTypes.STRING(20),
                comment: 'batch name'
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
            teacherName: {
                field: 'teacher_name',
                type: DataTypes.STRING(100),
                comment: 'name of teacher'
            },
            companyName: {
                field: 'company_name',
                type: DataTypes.STRING(100),
                comment: 'name of the company'
            },
            companyLocation: {
                field: 'company_location',
                type: DataTypes.TEXT,
                comment: 'location of the company'
            },
            projectName: {
                field: 'project_name',
                type: DataTypes.STRING(150),
                comment: 'name of the project'
            },
            projectDescription: {
                field: 'project_description',
                type: DataTypes.TEXT,
                comment: 'description of the project'
            },
            joiningDate: {
                field: 'joining_date',
                type: DataTypes.DATE,
                comment: 'internship joining date'
            },
            endDate: {
                field: 'end_date',
                type: DataTypes.DATE,
                comment: 'internship end date'
            },
            internshipLetter: {
                field: 'internship_letter',
                type: DataTypes.STRING(255),
                comment: 'internship_letter'
            },
            projectLetter: {
                field: 'project_letter',
                type: DataTypes.STRING(255),
                comment: 'project_letter'
            },
            isCompanyApproved: {
                field: 'is_company_approved',
                type: DataTypes.TINYINT,
                defaultValue: 3,
                comment: '1-approved 2-reject 3-pending'
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
            teacherIdFk:{
                field: 'teacher_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_teacher',
                    key: 'teacher_id_pk'
                },
                comment: 'teacher table foreign key'
            },
        },
        {}
    );
      // noinspection JSUnusedLocalSymbols
    studentTbl.associate = function (models) {}
    studentTbl.isCorrectPassword = async function (id, password, callback) {
        await studentTbl
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
    return studentTbl
}
