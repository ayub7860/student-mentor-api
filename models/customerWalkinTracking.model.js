
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const customerWalkinTrackingTbl = sequelize.define(
        'tbl_customer_walkin_tracking',
        {
            id: {
                field: 'customer_walkin_tracking_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
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
            oldStaffIdFk:{
                field: 'old_staff_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_staff',
                    key: 'staff_id_pk'
                },
                comment: 'staff table foreign key'
            },
            newStaffIdFk:{
                field: 'new_staff_id_fk',
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
    customerWalkinTrackingTbl.associate = function (models) {}
    return customerWalkinTrackingTbl
}
