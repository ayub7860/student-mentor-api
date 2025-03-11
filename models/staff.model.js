
'use strict';
const bcrypt = require('bcrypt')
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const staffTbl = sequelize.define(
        'tbl_staff',
        {
            id: {
                field: 'staff_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            staffCode: {
                field: 'staff_code',
                type: DataTypes.STRING(25),
                comment: 'staff code'
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
            division: {
                field: 'division',
                type: DataTypes.STRING(80),
                comment: 'division'
            },   
            lastYearTarget: {
                field: 'last_year_target',
                type: DataTypes.DECIMAL(12, 2),
                comment: 'last year target'
            }, 
            target: {
                field: 'target',
                type: DataTypes.DECIMAL(12, 2),
                comment: 'target'
            },          
            joiningDate: {
                field: 'joining_date',
                type: DataTypes.DATEONLY,
                comment: 'joining date'
            },
            leavingDate: {
                field: 'leaving_date',
                type: DataTypes.DATEONLY,
                comment: 'leaving date'
            },
            totalCustomer: {
                field: 'total_customer',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total customer '
            },
            totalCustomerActive: {
                field: 'total_customer_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total customer active'
            },
            totalAccounts: {
                field: 'total_accounts',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total accounts'
            },
            totalActiveAccounts: {
                field: 'total_active_accounts',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total active accounts'
            },
            totalSaving: {
                field: 'total_saving',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total saving'
            },            
            totalSavingActive: {
                field: 'total_saving_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total saving active'
            },   
            totalCurrent: {
                field: 'total_current',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total current'
            },
            totalCurrentActive: {
                field: 'total_current_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total current active'
            },
            totalPigmy: {
                field: 'total_pigmy',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total pigmy'
            },
            totalPigmyActive: {
                field: 'total_pigmy_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total pigmy active'
            },
            totalFd: {
                field: 'total_fd',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total fd'
            },
            totalFdActive: {
                field: 'total_fd_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total fd active'
            },
            totalLoan: {
                field: 'total_loan',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total loan'
            },
            totalLoanActive: {
                field: 'total_loan_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total loan active'
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
            plainTextPassword: {
                field: 'plain_text_password',
                type: DataTypes.STRING(255),
                comment: 'Plain Text Password'
            },
            branchIdFk:{
                field: 'branch_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_branch',
                    key: 'branch_id_pk'
                },
                comment: 'branch table foreign key'
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
    staffTbl.associate = function (models) {}
    staffTbl.isCorrectPassword = async function (id, password, callback) {
        await staffTbl
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
    return staffTbl
}
