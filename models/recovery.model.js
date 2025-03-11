
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const recoveryTbl = sequelize.define(
        'tbl_recovery',
        {
            id: {
                field: 'recovery_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            leadNo: {
                field: 'lead_no',
                type: DataTypes.STRING(15),
                comment: 'lead no'
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
            amount: {
                field: 'amount',
                type: DataTypes.DECIMAL(8, 2),
                comment: 'amount'
            },
            recoveryAmount: {
                field: 'recovery_amount',
                type: DataTypes.DECIMAL(8, 2),
                comment: 'recovery_amount'
            },
            recoveryDate: {
                field: 'recovery_date',
                type: DataTypes.DATEONLY,
                comment: 'recovery date'
            },
            remark: {
                field: 'remark',
                type: DataTypes.STRING(100),
                comment: 'remark'
            },
            comissionAmount: {
                field: 'comission_amount',
                type: DataTypes.DECIMAL(8, 2),
                defaultValue: 0.0,
                comment: 'comission amount'
            },
            comissionPercentage: {
                field: 'comission_percentage',
                type: DataTypes.DECIMAL(5, 2),
                defaultValue: 0.0,
                comment: 'comission percentage'
            },            
            comissionStatus: {
                field: 'comission_status',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '1-waiting for approval, 2-comission assigned, 3-comission calculated'
            }, 
            comissionDate: {
                field: 'comission_date',
                type: DataTypes.DATEONLY,
                comment: 'comission date'
            }, 
            comissionMonth: {
                field: 'comission_month',
                type: DataTypes.STRING(10),
                comment: 'comission month'
            }, 
            comissionYear: {
                field: 'comission_year',
                type: DataTypes.STRING(5),
                comment: 'comission year'
            }, 
            comissionAssignedBy: {
                field: 'comission_assigned_by',
                type: DataTypes.STRING(50),
                comment: 'comission assigned by'
            },
            status: {
                field: 'status',
                type: DataTypes.TINYINT,
                defaultValue: 3,
                comment: 'status (1-approved, 2-reject, 3-added)'
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
            productIdFk:{
                field: 'product_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_product',
                    key: 'product_id_pk'
                },
                comment: 'product table foreign key'
            },
            customerIdFk:{
                field: 'customer_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_customer',
                    key: 'customer_id_pk'
                },
                comment: 'customer table foreign key'
            },
            customerProductIdFk:{
                field: 'customer_product_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_customer_product',
                    key: 'customer_product_id_pk'
                },
                comment: 'customer product table foreign key'
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
            staffPayoutIdFk:{
                field: 'staff_payout_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_staff_payout',
                    key: 'staff_payout_id_pk'
                },
                comment: 'staff payout table foreign key'
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
    recoveryTbl.associate = function (models) {}
    return recoveryTbl
}
