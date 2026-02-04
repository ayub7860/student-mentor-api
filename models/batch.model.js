
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const batchTbl = sequelize.define(
        'tbl_batch',
        {
            id: {
                field: 'batch_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            name: {
                field: 'name',
                type: DataTypes.STRING(150),
                comment: 'batch name'
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
    batchTbl.associate = function (models) {}
    return batchTbl
}
