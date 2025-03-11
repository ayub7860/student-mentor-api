
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const customerTbl = sequelize.define(
        'tbl_customer',
        {
            id: {
                field: 'customer_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            customerName: {
                field: 'customer_name',
                type: DataTypes.STRING(150),
                comment: 'customer name'
            },
            customerMobile: {
                field: 'customer_mobile',
                type: DataTypes.STRING(12),
                comment: 'customer mobile'
            },
            email: {
                field: 'email',
                type: DataTypes.STRING(150),
                comment: 'email'
            },
            customerAadhaar: {
                field: 'customer_aadhaar',
                type: DataTypes.STRING(12),
                unique: true,
                comment: 'customer aadhaar'
            },
            customerAddress: {
                field: 'customer_address',
                type: DataTypes.TEXT,
                comment: 'customer address'
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
            joiningDate: {
                field: 'joining_date',
                type: DataTypes.DATEONLY,
                comment: 'joining date'
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
            status: {
                field: 'status',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: 'status'
            },
            exitStatus: {
                field: 'exit_status',
                type: DataTypes.TINYINT,
                defaultValue: 0,
                comment: 'status'
            },
            exStaffId: {
                field: 'ex_staff_id',
                type: DataTypes.INTEGER,
                comment: 'ex staff id'
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
            staffIdFk:{
                field: 'staff_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_staff',
                    key: 'staff_id_pk'
                },
                comment: 'staff table foreign key'
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
    customerTbl.associate = function (models) {}
    return customerTbl
}
