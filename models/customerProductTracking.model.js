
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const customerProductTrackingTbl = sequelize.define(
        'tbl_customer_products_tracking',
        {
            id: {
                field: 'product_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            remark: {
                field: 'remark',
                type: DataTypes.STRING(100),
                comment: 'remark'
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
    customerProductTrackingTbl.associate = function (models) {}
    return customerProductTrackingTbl
}
