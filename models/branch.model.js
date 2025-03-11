
'use strict';
const bcrypt = require('bcrypt')
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const branchTbl = sequelize.define(
        'tbl_branch',
        {
            id: {
                field: 'branch_id_pk',
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
            branchCode: {
                field: 'branch_code',
                type: DataTypes.STRING(25),
                comment: 'branch code'
            },   
            totalStaff: {
                field: 'total_staff',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total staff'
            },
            totalStaffActive: {
                field: 'total_staff_active',
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'total staff active'
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
            sequenceNo: {
                field: 'sequence_no',
                type: DataTypes.INTEGER,
                defaultValue: 300,
                comment: 'sequenceNo'
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
    branchTbl.associate = function (models) {}
    branchTbl.isCorrectPassword = async function (id, password, callback) {
        await branchTbl
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
    return branchTbl
}
