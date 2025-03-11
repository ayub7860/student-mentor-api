
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const productTbl = sequelize.define(
        'tbl_product',
        {
            id: {
                field: 'product_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            name: {
                field: 'name',
                type: DataTypes.STRING(60),
                comment: 'name'
            },
            glCode: {
                field: 'gl_code',
                type: DataTypes.STRING(25),
                comment: 'gl code'
            },
            productType: {
                field: 'product_type',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '(1-Saving, 2-Current, 3-Pigmy, 4-FD, 5-Loan, 6-RD, 7-Recovery)'
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
            comissionAmount: {
                field: 'comission_amount',
                type: DataTypes.DECIMAL(8, 2),
                defaultValue: 0.0,
                comment: 'comission amount'
            },
            comissionPercentage: {
                field: 'comission_percentage',
                type: DataTypes.DECIMAL(8, 2),
                defaultValue: 0.0,
                comment: 'comission percentage'
            },
            interestRate: {
                field: 'interest_rate',
                type: DataTypes.DECIMAL(8, 2),
                defaultValue: 0.0,
                comment: 'interest rate'
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
    productTbl.associate = function (models) {}
    return productTbl
}
