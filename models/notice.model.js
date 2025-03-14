
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const noticeTbl = sequelize.define(
        'tbl_notice',
        {
            id: {
                field: 'notice_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            title: {
                field: 'title',
                type: DataTypes.STRING(150),
                comment: 'title'
            },
            description: {
                field: 'description',
                type: DataTypes.TEXT,
                comment: 'description'
            },
            type: {
                field: 'type',
                type: DataTypes.TINYINT,
                defaultValue: 3,
                comment: '(1-teacher, 2-student, 3-both)'
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
    noticeTbl.associate = function (models) {}
    return noticeTbl
}
