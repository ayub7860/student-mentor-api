const { Sequelize } = require('sequelize')
const { DB_HOST, DB_PASS, DB_PORT, DB_USER, DB_NAME } = require('./config')

const websiteConfigModel = require('./models/websiteConfig.model')
const wallpaperModel = require('./models/wallpaper.model')
const userModel = require('./models/user.model')
const teacherModel = require('./models/teacher.model')

// const branchModel = require('./models/branch.model')
// const staffModel = require('./models/staff.model')
// const productModel = require('./models/product.model')
// const customerModel = require('./models/customer.model')
// const customerProductModel = require('./models/customerProduct.model')
// const customerProductTrackingModel = require('./models/customerProductTracking.model')
// const staffPayoutModel = require('./models/staffPayout.model')
// const customerWalkinTrackingModel = require('./models/customerWalkinTracking.model')
// const customerBranchShiftTrackingModel = require('./models/customerBranchShiftTracking.model')
// const staffTrackingModel = require('./models/staffTracking.model')
// const recoveryModel = require('./models/recovery.model')
// const recoveryTrackingModel = require('./models/recoveryTracking.model')

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

// const branchTbl = branchModel(sequelize, Sequelize)
// const staffTbl = staffModel(sequelize, Sequelize)
// const staffPayoutTbl = staffPayoutModel(sequelize, Sequelize)
// const productTbl = productModel(sequelize, Sequelize)
// const customerTbl = customerModel(sequelize, Sequelize)
// const customerProductTbl = customerProductModel(sequelize, Sequelize)
// const customerProductTrackingTbl = customerProductTrackingModel(sequelize, Sequelize)
// const customerBranchShiftTrackingTbl = customerBranchShiftTrackingModel(sequelize, Sequelize)
// const customerWalkinTrackingTbl = customerWalkinTrackingModel(sequelize, Sequelize)
// const staffTrackingTbl = staffTrackingModel(sequelize, Sequelize)
// const recoveryTbl = recoveryModel(sequelize, Sequelize)
// const recoveryTrackingTbl = recoveryTrackingModel(sequelize, Sequelize)

// customerTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// customerTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// customerProductTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// customerProductTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// staffTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// customerProductTrackingTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// customerProductTrackingTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// customerProductTrackingTbl.hasMany(userTbl, {
//   as: 'tbl_user',
//   foreignKey: 'user_id_pk',
//   sourceKey: 'userIdFk',
//   constraints: false
// })

// staffPayoutTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// staffPayoutTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// recoveryTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// recoveryTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'branchIdFk',
//   constraints: false
// })

// recoveryTrackingTbl.hasMany(userTbl, {
//   as: 'tbl_user',
//   foreignKey: 'user_id_pk',
//   sourceKey: 'userIdFk',
//   constraints: false
// })

// recoveryTrackingTbl.hasMany(staffTbl, {
//   as: 'tbl_staff',
//   foreignKey: 'staff_id_pk',
//   sourceKey: 'staffIdFk',
//   constraints: false
// })

// customerBranchShiftTrackingTbl.hasMany(branchTbl, {
//   as: 'tbl_branch',
//   foreignKey: 'branch_id_pk',
//   sourceKey: 'oldBranchIdFk',
//   constraints: false
// })

sequelize.sync({}).then(() => {
  console.log('Database & tables synced!')
})

module.exports = {
  websiteConfigTbl,
  wallpaperTbl,
  userTbl,
  teacherTbl
  // branchTbl,
  // staffTbl,
  // staffPayoutTbl,
  // productTbl,
  // customerTbl,
  // customerProductTbl,
  // customerProductTrackingTbl,
  // customerBranchShiftTrackingTbl,
  // customerWalkinTrackingTbl,
  // staffTrackingTbl,
  // recoveryTbl,
  // recoveryTrackingTbl,

}
