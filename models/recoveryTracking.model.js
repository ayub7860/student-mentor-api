
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const recoveryTrackingTbl = sequelize.define(
        'tbl_recovery_tracking',
        {
            id: {
                field: 'recovery_tracking_id_pk',
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
            status: {
                field: 'status',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: 'status'
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
            recoveryIdFk:{
                field: 'recovery_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_recovery',
                    key: 'recovery_id_pk'
                },
                comment: 'recovery table foreign key'
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
    recoveryTrackingTbl.associate = function (models) {}
    return recoveryTrackingTbl
}
