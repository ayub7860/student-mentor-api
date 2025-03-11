
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const customerBranchShiftTrackingTbl = sequelize.define(
        'tbl_customer_branch_shift_tracking',
        {
            id: {
                field: 'customer_branch_shift_tracking_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            oldBranchIdFk:{
                field: 'old_branch_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_branch',
                    key: 'branch_id_pk'
                },
                comment: 'branch table foreign key'
            },
            newBranchIdFk:{
                field: 'new_branch_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_branch',
                    key: 'branch_id_pk'
                },
                comment: 'branch table foreign key'
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
    customerBranchShiftTrackingTbl.associate = function (models) {}
    return customerBranchShiftTrackingTbl
}
