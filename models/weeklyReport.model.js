
'use strict';
module.exports = (sequelize,DataTypes) => {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const weeklyReportTbl = sequelize.define(
        'tbl_weekly_report',
        {
            id: {
                field: 'weekly_report_id_pk',
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: 'Auto generated key'
            },
            fromDate: {
                field: 'from_date',
                type: DataTypes.DATEONLY,
                comment: 'from date'
            }, 
            toDate: {
                field: 'to_date',
                type: DataTypes.DATEONLY,
                comment: 'to date'
            }, 
            task: {
                field: 'task',
                type: DataTypes.TEXT,
                comment: 'task'
            }, 
            description: {
                field: 'description',
                type: DataTypes.TEXT,
                comment: 'work description'
            },                     
            isApprovedByTeacher: {
                field: 'is_approved_by_teacher',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '1-approved, 2-not approved, 3-pending'
            },
            studentName: {
                field: 'student_name',
                type: DataTypes.STRING(250),
                comment: 'student name'
            },  
            teacherName: {
                field: 'teacher_name',
                type: DataTypes.STRING(250),
                comment: 'teacher name'
            },            
            status: {
                field: 'status',
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: 'status'
            },
            teacherIdFk:{
                field: 'teacher_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_teacher',
                    key: 'teacher_id_pk'
                },
                comment: 'teacher table foreign key'
            },
            studentIdFk:{
                field: 'student_id_fk',
                type: DataTypes.INTEGER,
                references: {
                    model: 'tbl_student',
                    key: 'student_id_pk'
                },
                comment: 'student table foreign key'
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
    weeklyReportTbl.associate = function (models) {}
    return weeklyReportTbl
}
