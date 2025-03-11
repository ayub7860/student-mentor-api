
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const customerProductTbl = sequelize.define(
        'tbl_customer_product',
        {
            id: {
                field: 'customer_product_id_pk',
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
            glCode: {
                field: 'gl_code',
                type: DataTypes.STRING(25),
                comment: 'gl code'
            },
            accNumber: {
                field: 'acc_number',
                type: DataTypes.STRING(25),
                comment: 'acc number'
            },
            accAmount: {
                field: 'accAmount',
                type: DataTypes.DECIMAL(12, 2),
                comment: 'accAmount'
            },
            renewalAmount: {
                field: 'renewal_amount',
                type: DataTypes.DECIMAL(12, 2),
                comment: 'renewal_amount'
            },
            savingAccountNumber: {
                field: 'saving_account_number',
                type: DataTypes.STRING(60),
                comment: 'saving acc number'
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
                comment: 'customer aadhaar'
            },            
            openingDate: {
                field: 'opening_date',
                type: DataTypes.DATEONLY,
                comment: 'opening date'
            },
            maturityDate: {
                field: 'maturity_date',
                type: DataTypes.DATEONLY,
                comment: 'maturity date'
            },
            maturityAmount: {
                field: 'maturity_amount',
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0.00,
                comment: 'maturity amount'
            },
            productName: {
                field: 'product_name',
                type: DataTypes.STRING(60),
                comment: 'product name'
            },            
            productType: {
                field: 'product_type',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '(1-Saving, 2-Current, 3-Pigmy, 4-FD, 5-Loan)'
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
            remark: {
                field: 'remark',
                type: DataTypes.STRING(100),
                comment: 'remark'
            },
            accountType: {
                field: 'account_type',
                type: DataTypes.STRING(20),
                comment: 'account type'
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
            days: {
                field: 'days',
                type: DataTypes.STRING(20),
                comment: 'days'
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
    customerProductTbl.associate = function (models) {}
    return customerProductTbl
}
