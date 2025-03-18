const { Sequelize } = require('sequelize')
const { DB_HOST, DB_PASS, DB_PORT, DB_USER, DB_NAME } = require('./config')

const websiteConfigModel = require('./models/websiteConfig.model')
const wallpaperModel = require('./models/wallpaper.model')
const userModel = require('./models/user.model')
const teacherModel = require('./models/teacher.model')
const studentModel = require('./models/student.model')
const noticeModel = require('./models/notice.model')
const weeklyReportModel = require('./models/weeklyReport.model')


const Op = Sequelize.Op
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  pool: {
    max: 10,
    min: 0,
    acquire: 150000,
    idle: 1000
  },
  timezone: '+05:30',
  define: {
    freezeTableName: true
  },
  logging: false,
  operatorsAliases
})

const websiteConfigTbl = websiteConfigModel(sequelize, Sequelize)
const wallpaperTbl = wallpaperModel(sequelize, Sequelize)
const userTbl = userModel(sequelize, Sequelize)
const teacherTbl = teacherModel(sequelize, Sequelize)
const studentTbl = studentModel(sequelize, Sequelize)
const noticeTbl = noticeModel(sequelize, Sequelize)
const weeklyReportTbl = weeklyReportModel(sequelize, Sequelize)


// customerTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

sequelize.sync({}).then(() => {
  console.log('Database & tables synced!')
})

module.exports = {
  websiteConfigTbl,
  wallpaperTbl,
  userTbl,
  teacherTbl,
  studentTbl,
  noticeTbl,
  weeklyReportTbl,
  
}
