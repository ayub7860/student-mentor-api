const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  customerTbl,
  branchTbl,
  staffTbl,
  customerProductTbl,
  customerProductTrackingTbl,
  productTbl,
  userTbl,
  websiteConfigTbl
} = require('../sequelize')
const { handleSequelizeError } = require('../sequelizeErrorHandler')

const customerProductController = {}

customerProductController.getTableCustomerProduct = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue, fromDate, toDate } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords

    let whereClause = {
      status: 1,
      [Op.or]: [
        { customerName: { [Op.like]: '%' + searchValue + '%' } }
      ]
    };

    if (fromDate && toDate) {
      whereClause.status = 1;
      whereClause[Op.and] = [
        { createdAt: { [Op.between]: [fromDate, new Date(new Date(toDate).setHours(23, 59, 59, 999))] } }
      ];
    }

    const customerTblResult = await customerProductTbl.findAll({
      // where: {
      //   [Op.or]: [
      //     { customerName: { [Op.like]: '%' + searchValue + '%' } }
      //   ]
      // },
      where: whereClause,
      include: [
        {
            model: branchTbl,
            as: 'tbl_branch',
        },
        {
            model: staffTbl,
            as: 'tbl_staff',
        }
      ],
      order: [[orderBy, orderDirection]],
      offset: start,
      limit: perPage
    })
    start++
    const tableData = customerTblResult.map((obj, index) => {
        let branchName = '';
        if(obj.get('tbl_branch').length !== 0)
            branchName = obj.get('tbl_branch')[0].get("name");
        let staffName = '';
        if(obj.get('tbl_staff').length !== 0)
            staffName = obj.get('tbl_staff')[0].get("name");
        return {
            srno: start++,
            id: obj.get('id'),
            branchName,
            staffName,
            leadNo: obj.get('leadNo'),
            glCode: obj.get('glCode'),
            accNumber: obj.get('accNumber'),
            accAmount: obj.get('accAmount'),
            renewalAmount: obj.get('renewalAmount'),
            savingAccountNumber: obj.get('savingAccountNumber'),
            customerName: obj.get('customerName'),
            customerMobile: obj.get('customerMobile'),
            customerAadhaar: obj.get('customerAadhaar'),
            openingDate: obj.get('openingDate'),
            maturityDate: obj.get('maturityDate'),
            productName: obj.get('productName'),
            productType: obj.get('productType'),
            comissionAmount: obj.get('comissionAmount'),
            comissionPercentage: obj.get('comissionPercentage'),
            remark: obj.get('remark'),
            comissionStatus: obj.get('comissionStatus'),
            comissionDate: obj.get('comissionDate'),
            comissionMonth: obj.get('comissionMonth'),
            comissionYear: obj.get('comissionYear'),
            comissionAssignedBy: obj.get('comissionAssignedBy'),
            branchIdFk: obj.get('branchIdFk'),
            productIdFk: obj.get('productIdFk'),
            customerIdFk: obj.get('customerIdFk'),
            staffIdFk: obj.get('staffIdFk'),
            status: obj.get('status'),
            days: obj.get('days'),
            exitStatus: obj.get('exitStatus'),
            createdAt: obj.get('createdAt'),
            updatedAt: obj.get('updatedAt')
        }
    })
    const totalRecords = await customerProductTbl.count({
      // where: {
      //   [Op.or]: [
      //     { customerName: { [Op.like]: '%' + searchValue + '%' } }
      //   ]
      // }
      where: whereClause,
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getTableCustomerProduct')
  }
}

customerProductController.changeStatusCustomerProduct = async function (req, res) {
  try {
    const { id, statusValue } = req.body
    await customerProductTbl.update({ status: statusValue }, { where: { id } })
      .then(async() => {
        res.status(200).send('Data updated successfully');

        await customerProductTrackingTbl.create({
          remark: statusValue === 1 ? 'status active by Admin' : 'status in-active by Admin',
          customerProductIdFk: id,
          userIdFk: req.uid
        });
        await updateAllCounts(id, statusValue)
      })
      .catch((err) => {
        handleSequelizeError(err, res, 'customerProductController.changeStatusCustomerProduct')
      })
  } catch (err) {
    console.log('customerProductData',err);
    handleSequelizeError(err, res, 'customerProductController.changeStatusCustomerProduct')
  }
}

const updateAllCounts = async (customerProductId, status) => {
  const customerProductData = await customerProductTbl.findByPk(customerProductId);
  const productType = customerProductData.productType;
  const branchData = await branchTbl.findByPk(customerProductData.branchIdFk);
  const staffData = await staffTbl.findByPk(customerProductData.staffIdFk);
  const customerData = await customerTbl.findByPk(customerProductData.customerIdFk);
  const productData = await productTbl.findByPk(customerProductData.productIdFk);

  if(status === 2 || status === 3){
    const totalActiveAccountsTemp = productData.totalActiveAccounts;
    await productData.update({ totalActiveAccounts: totalActiveAccountsTemp - 1 });
    const totalActiveAccountsTemp1 = staffData.totalActiveAccounts;
    await staffData.update({ totalActiveAccounts: totalActiveAccountsTemp1 - 1 });
    const totalActiveAccountsTemp2 = customerData.totalActiveAccounts;
    await customerData.update({ totalActiveAccounts: totalActiveAccountsTemp2 - 1 });
    const totalActiveAccountsTemp3 = branchData.totalActiveAccounts;
    await branchData.update({ totalActiveAccounts: totalActiveAccountsTemp3 - 1 });

    if(productType === 1){
      // staff
      const totalSavingActiveTemp = staffData.totalSavingActive;
      await staffData.update({ totalSavingActive: totalSavingActiveTemp - 1 });

      // customer
      const totalSavingActiveTemp1 = customerData.totalSavingActive;
      await customerData.update({ totalSavingActive: totalSavingActiveTemp1 - 1 });

      //branch
      const totalSavingActiveTemp2 = branchData.totalSavingActive;
      await branchData.update({ totalSavingActive: totalSavingActiveTemp2 - 1 });

    } else if(productType === 2){
      // staff
      const totalCurrentActiveTemp = staffData.totalCurrentActive;
      await staffData.update({ totalCurrentActive: totalCurrentActiveTemp - 1 });

      // customer
      const totalCurrentActiveTemp1 = customerData.totalCurrentActive;
      await customerData.update({ totalCurrentActive: totalCurrentActiveTemp1 - 1 });

      //branch
      const totalCurrentActiveTemp2 = branchData.totalCurrentActive;
      await branchData.update({ totalCurrentActive: totalCurrentActiveTemp2 - 1 });

    } else if(productType === 3){
      // staff
      const totalPigmyActiveTemp = staffData.totalPigmyActive;
      await staffData.update({ totalPigmyActive: totalPigmyActiveTemp - 1 });

      // customer
      const totalPigmyActiveTemp1 = customerData.totalPigmyActive;
      await customerData.update({ totalPigmyActive: totalPigmyActiveTemp1 - 1 });

      //branch
      const totalPigmyActiveTemp2 = branchData.totalPigmyActive;
      await branchData.update({ totalPigmyActive: totalPigmyActiveTemp2 - 1 });

    } else if(productType === 4){
      // staff
      const totalFdActiveTemp = staffData.totalFdActive;
      await staffData.update({ totalFdActive: totalFdActiveTemp - 1 });

      // customer
      const totalFdActiveTemp1 = customerData.totalFdActive;
      await customerData.update({ totalFdActive: totalFdActiveTemp1 - 1 });

      //branch
      const totalFdActiveTemp2 = branchData.totalFdActive;
      await branchData.update({ totalFdActive: totalFdActiveTemp2 - 1 });

    } else if(productType === 5){
      // staff
      const totalLoanActiveTemp = staffData.totalLoanActive;
      await staffData.update({ totalLoanActive: totalLoanActiveTemp - 1 });

      // customer
      const totalLoanActiveTemp1 = customerData.totalLoanActive;
      await customerData.update({ totalLoanActive: totalLoanActiveTemp1 - 1 });

      //branch
      const totalLoanActiveTemp2 = branchData.totalLoanActive;
      await branchData.update({ totalLoanActive: totalLoanActiveTemp2 - 1 });
    }  
  } else {
    const totalActiveAccountsTemp = productData.totalActiveAccounts;
    await productData.update({ totalActiveAccounts: totalActiveAccountsTemp + 1 });

    const totalActiveAccountsTemp1 = staffData.totalActiveAccounts;
    await staffData.update({ totalActiveAccounts: totalActiveAccountsTemp1 + 1 });

    const totalActiveAccountsTemp2 = customerData.totalActiveAccounts;
    await customerData.update({ totalActiveAccounts: totalActiveAccountsTemp2 + 1 });

    const totalActiveAccountsTemp3 = branchData.totalActiveAccounts;
    await branchData.update({ totalActiveAccounts: totalActiveAccountsTemp3 + 1 });

    if(productType === 1){
      // staff
      const totalSavingActiveTemp = staffData.totalSavingActive;
      await staffData.update({ totalSavingActive: totalSavingActiveTemp + 1 });

      // customer
      const totalSavingActiveTemp1 = customerData.totalSavingActive;
      await customerData.update({ totalSavingActive: totalSavingActiveTemp1 + 1 });

      //branch
      const totalSavingActiveTemp2 = branchData.totalSavingActive;
      await branchData.update({ totalSavingActive: totalSavingActiveTemp2 + 1 });

    } else if(productType === 2){
      // staff
      const totalCurrentActiveTemp = staffData.totalCurrentActive;
      await staffData.update({ totalCurrentActive: totalCurrentActiveTemp + 1 });

      // customer
      const totalCurrentActiveTemp1 = customerData.totalCurrentActive;
      await customerData.update({ totalCurrentActive: totalCurrentActiveTemp1 + 1 });

      //branch
      const totalCurrentActiveTemp2 = branchData.totalCurrentActive;
      await branchData.update({ totalCurrentActive: totalCurrentActiveTemp2 + 1 });

    } else if(productType === 3){
      // staff
      const totalPigmyActiveTemp = staffData.totalPigmyActive;
      await staffData.update({ totalPigmyActive: totalPigmyActiveTemp + 1 });

      // customer
      const totalPigmyActiveTemp1 = customerData.totalPigmyActive;
      await customerData.update({ totalPigmyActive: totalPigmyActiveTemp1 + 1 });

      //branch
      const totalPigmyActiveTemp2 = branchData.totalPigmyActive;
      await branchData.update({ totalPigmyActive: totalPigmyActiveTemp2 + 1 });

    } else if(productType === 4){
      // staff
      const totalFdActiveTemp = staffData.totalFdActive;
      await staffData.update({ totalFdActive: totalFdActiveTemp + 1 });

      // customer
      const totalFdActiveTemp1 = customerData.totalFdActive;
      await customerData.update({ totalFdActive: totalFdActiveTemp1 + 1 });

      //branch
      const totalFdActiveTemp2 = branchData.totalFdActive;
      await branchData.update({ totalFdActive: totalFdActiveTemp2 + 1 });

    } else if(productType === 5){
      // staff
      const totalLoanActiveTemp = staffData.totalLoanActive;
      await staffData.update({ totalLoanActive: totalLoanActiveTemp + 1 });

      // customer
      const totalLoanActiveTemp1 = customerData.totalLoanActive;
      await customerData.update({ totalLoanActive: totalLoanActiveTemp1 + 1 });

      //branch
      const totalLoanActiveTemp2 = branchData.totalLoanActive;
      await branchData.update({ totalLoanActive: totalLoanActiveTemp2 + 1 });
    }  
  }
}

customerProductController.getCSVTableAdminCustomerProduct = async function (req, res) {
  try {
    const {fromDate, toDate } = req.body;
    if (fromDate && toDate) {
      whereClause[Op.and] = [
        { createdAt: { [Op.between]: [fromDate, toDate] } }
      ];
    } else {
      whereClause = {}
    }

    const customerTblResult = await customerProductTbl.findAll({
      where: whereClause,
      // where: {},
      include: [
        {
            model: branchTbl,
            as: 'tbl_branch',
        },
        {
            model: staffTbl,
            as: 'tbl_staff',
        }
      ],
      order: [['createdAt', 'desc']]
    })
    let start = 1
    const tableData = customerTblResult.map((obj, index) => {
      let branchName = '';
      if(obj.get('tbl_branch').length !== 0)
          branchName = obj.get('tbl_branch')[0].get("name");
      let staffName = '';
      if(obj.get('tbl_staff').length !== 0)
          staffName = obj.get('tbl_staff')[0].get("name");
      return {
        srno: start++,
        branchName,
        staffName,
        leadNo: obj.leadNo,
        glCode: obj.glCode,
        accNumber: obj.accNumber,
        accAmount: obj.accAmount,
        renewalAmount: obj.renewalAmount,
        customerName: obj.customerName,
        customerMobile: obj.customerMobile,
        customerAadhaar: obj.customerAadhaar,
        openingDate: obj.openingDate,
        maturityDate: obj.maturityDate,
        productName: obj.productName,
        productType: obj.productType,
        comissionAmount: obj.comissionAmount,
        comissionPercentage: obj.comissionPercentage,
        remark: obj.remark,
        comissionStatus: obj.comissionStatus,
        comissionDate: obj.comissionDate,
        comissionMonth: obj.comissionMonth,
        comissionYear: obj.comissionYear,
        comissionAssignedBy: obj.comissionAssignedBy,
        staffIdFk: obj.staffIdFk,
        branchIdFk: obj.branchIdFk,
        status: obj.status,
        updatedAt: obj.updatedAt,
        createdAt: obj.createdAt
      }
    })
    res.status(200).json({ tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getCSVTableAdminCustomerProduct')
  }
}

customerProductController.getTrackingDetails = async function (req, res) {
  try {
    const { id } = req.query;
    const customerTblResult = await customerProductTrackingTbl.findAll({
      where: {
        [Op.and]: [{ customerProductIdFk : id }],
      },
      include: [
        {
            model: branchTbl,
            as: 'tbl_branch',
        },
        {
            model: staffTbl,
            as: 'tbl_staff',
        },
        {
          model: userTbl,
          as: 'tbl_user',
        }
      ],
      order: [[ 'createdAt', 'desc']]
    })

    const tableData = customerTblResult.map((obj, index) => {
      let branchName = '';
      if(obj.get('tbl_branch').length !== 0)
          branchName = obj.get('tbl_branch')[0].get("name");
      let staffName = '';
      if(obj.get('tbl_staff').length !== 0)
          staffName = obj.get('tbl_staff')[0].get("name");
      let userName = '';
      if(obj.get('tbl_user').length !== 0)
          userName = obj.get('tbl_user')[0].get("personName");
      return {
          id: obj.get('id'),
          branchName,
          staffName,
          userName,
          remark: obj.get('remark'),
          createdAt: obj.get('createdAt'),
          updatedAt: obj.get('updatedAt')
      }
    })

    res.status(200).json({tableData})
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.checkCustomerAndGetDetails')
  }
}

customerProductController.closeAccountByAdmin = async function (req, res) {
  try {
    const { id } = req.body;

    const customerProductData = await customerProductTbl.findByPk(id);
    if(customerProductData){
      await customerProductData.update({ 
        status : 3
      });

      await customerProductTrackingTbl.create({
        remark: `account close by Admin`,
        customerProductIdFk: id,
        userIdFk: req.uid
      });

      res.status(200).json('added')
    } else {
      res.status(204).json('not found')
    }   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.closeAccount')
  }
}

customerProductController.accountOpenAndCloseByAdmin = async function (req, res) {
  try {
    const { id, statusValue } = req.body;

    const customerProductData = await customerProductTbl.findByPk(id);
    if(customerProductData){
      await customerProductData.update({ 
        status : statusValue
      });

      if(statusValue === 3){
        await customerProductTrackingTbl.create({
          remark: `account close by Admin`,
          customerProductIdFk: id,
          userIdFk: req.uid
        });
      } else {
        await customerProductTrackingTbl.create({
          remark: `account open by Admin`,
          customerProductIdFk: id,
          userIdFk: req.uid
        });
      }
      
      await updateAllCounts(id, statusValue);
      res.status(200).json('added')
    } else {
      res.status(204).json('not found')
    }   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.accountOpenAndCloseByAdmin')
  }
}

customerProductController.getCommisionData = async function (req, res) {
  try {
    const { id  } = req.query;

    const customerProductData = await customerProductTbl.findByPk(id);
    const productData = await productTbl.findByPk(customerProductData.productIdFk)

    if(productData){
      res.status(200).json({ productData })
    } else {
      res.status(204).json('not found')
    }   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getCommisionData')
  }
}

customerProductController.addComissionToStaff = async function (req, res) {
  try {
    const { comissionAmount, comissionPercentage, customerProductId } = req.body;

    const customerProductData = await customerProductTbl.findByPk(customerProductId);

    const date = new Date();
    const options = { month: 'short' }; // For short month name
    const currentMonth = new Intl.DateTimeFormat('en-US', options).format(date); // 'en-US' can be changed to your locale
    const currentYear = date.getFullYear();

    if(customerProductData){
      const staffData = await staffTbl.findByPk(customerProductData.staffIdFk)
      await customerProductData.update({ 
        comissionAmount,
        comissionPercentage,
        comissionDate: date,
        comissionMonth: currentMonth,
        comissionYear: currentYear,
        comissionAssignedBy: staffData.name,
        comissionStatus: 2
      });

      await customerProductTrackingTbl.create({
        remark: `commission added to ${staffData.name}, commission amount - ${comissionAmount}`,
        customerProductIdFk: customerProductId,
        userIdFk: req.uid
      });

      res.status(200).json('added')
    } else {
      res.status(204).json('not found')
    }   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.addComissionToStaff')
  }
}

customerProductController.resetComissionToStaff = async function (req, res) {
  try {
    const { id } = req.body;

    const customerProductData = await customerProductTbl.findByPk(id);

    if(customerProductData){
      await customerProductData.update({ 
        comissionAmount: 0,
        comissionPercentage: 0,
        comissionDate: null,
        comissionMonth: null,
        comissionYear: null,
        comissionAssignedBy: null,
        comissionStatus: 1
      });

      await customerProductTrackingTbl.create({
        remark: `commission reset by Admin`,
        customerProductIdFk: id,
        userIdFk: req.uid
      });

      res.status(200).json('added')
    } else {
      res.status(204).json('not found')
    }   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.addComissionToStaff')
  }
}

const getLeadNo = async (productType) => {
  const detailsObj = await websiteConfigTbl.findByPk(1)
  if(productType === 1){
    const srno = detailsObj.leadCounterSaving
    await detailsObj.update({ leadCounterSaving: srno + 1 })
    return `AAS-${srno}`;
  } else if(productType === 2){
    const srno = detailsObj.leadCounterCurrent
    await detailsObj.update({ leadCounterCurrent: srno + 1 })
    return `AAC-${srno}`;
  } else if(productType === 3){
    const srno = detailsObj.leadCounterPigmy
    await detailsObj.update({ leadCounterPigmy: srno + 1 })
    return `AAP-${srno}`;
  } else if(productType === 4){
    const srno = detailsObj.leadCounterFd
    await detailsObj.update({ leadCounterFd: srno + 1 })
    return `AAFD-${srno}`;
  } else if(productType === 5){
    const srno = detailsObj.leadCounterLoan
    await detailsObj.update({ leadCounterLoan: srno + 1 })
    return `AAL-${srno}`;
  }  else if(productType === 6){
    const srno = detailsObj.leadCounterRD
    await detailsObj.update({ leadCounterRD: srno + 1 })
    return `AARD-${srno}`;
  } else if(productType === 7){
    const srno = detailsObj.leadCounterRecovery
    await detailsObj.update({ leadCounterRecovery: srno + 1 })
    return `AARC-${srno}`;
  }  
}

// customerProductController.addCustomerProductFromExcel = async function (req, res) {
//   try {
//     const { tableData } = req.body;
//     for(const item of tableData){

//       const staffData = await staffTbl.findOne({
//         where: { 
//           name : item.staffName
//         }
//       });

//       const productData = await productTbl.findOne({
//         where: { 
//           name : item.productName
//         }
//       });

//       const branchData = await branchTbl.findByPk(staffData.branchIdFk);
//       const customerData = await customerTbl.findOne({ where : { customerAadhaar : item.aadhaar, staffIdFk: staffData.id }});
//       const leadNo = await getLeadNo(productData.productType);
 
//       let isCustomer = 0
//       if(customerData) isCustomer = 1;

//       if(customerData){
//         await customerProductTbl.create({
//           leadNo: leadNo,
//           glCode: item.glCode,
//           accNumber: item.accountNumber,
//           accAmount: item.amount,
//           customerName: customerData.customerName,
//           customerMobile: customerData.customerMobile,
//           customerAadhaar: customerData.customerAadhaar,
//           // email: item.email,
//           openingDate: item.openingDate ? item.openingDate : null,
//           maturityDate: item.maturityDate ? item.maturityDate : null,
//           maturityAmount: item.maturityAmount,
//           productName: item.productName,
//           productType: productData.productType,
//           remark: item.remark,
//           accountType: item.accountType,
//           branchIdFk: staffData.branchIdFk,
//           productIdFk: productData.id,
//           customerIdFk: customerData.id,
//           staffIdFk: staffData.id,
//         }).then(async(obj) => {          
//           await customerProductTrackingTbl.create({
//             remark: 'added by Admin',
//             customerProductIdFk: obj.id,
//             staffIdFk: staffData.id
//           })
//         })
//       } else {
//         await customerTbl.create({
//           customerName: item.customerName,
//           customerMobile: item.mobile,
//           customerAadhaar: item.aadhaar,
//           joiningDate: item.openingDate ? item.openingDate : null,
//           staffIdFk: staffData.id,
//           branchIdFk: staffData.branchIdFk,
//         }).then(async(obj)=>{
//           const cpData = await customerProductTbl.create({
//             leadNo: item.leadNo,
//             glCode: item.glCode,
//             accNumber: item.accountNumber,
//             accAmount: item.amount,
//             customerName: item.customerName,
//             customerMobile: item.mobile,
//             customerAadhaar: item.aadhaar,
//             email: item.email,
//             openingDate: item.openingDate ? item.openingDate : null,
//             maturityDate: item.maturityDate ? item.maturityDate : null,
//             maturityAmount: item.maturityAmount,
//             productName: item.productName,
//             productType: productData.productType,
//             remark: item.remark,
//             accountType: item.accountType,
//             branchIdFk: staffData.branchIdFk,
//             productIdFk: productData.id,
//             customerIdFk: obj.id,
//             staffIdFk: staffData.id,
//           });

//           await customerProductTrackingTbl.create({
//             remark: 'added by Admin',
//             customerProductIdFk: cpData.id,
//             staffIdFk: staffData.id
//           });
//         })
//       }
//     }  
//     res.status(201).send('saved to database'); 
//   } catch (err) {
//     handleSequelizeError(err, res, 'customerProductController.addCustomerProductFromExcel')
//   }
// }

const getProductTypeValue = (productTypeLabel) => {
  switch (productTypeLabel.toLowerCase()) {
    case 'saving':
      return 1;
    case 'current':
      return 2;
    case 'pigmy':
      return 3;
    case 'fd':
      return 4;
    case 'loan':
      return 5;
    case 'rd':
      return 6;
    case 'recovery':
      return 7;
    default:
      return null; // or a default value if needed
  }
};

customerProductController.addCustomerProductFromExcel = async function (req, res) {
  try {
    const { tableData } = req.body;
    
    for (const item of tableData) {
      // Find or create the staff
      const staffData = await staffTbl.findOne({ where: { name: item.staffName } });

      const productTypeValue = getProductTypeValue(item.productType);
      // Find the product, and create it if not found
      const [productData] = await productTbl.findOrCreate({
        where: { name: item.productName },
        defaults: {
          name: item.productName,
          productType: productTypeValue // Assuming `productType` comes from the Excel data or needs to be derived
        }
      });

      if (!staffData) {
        continue; // Skip if staff is not found
      }

      // Find the customer, or create if not found
      const [customerData, created] = await customerTbl.findOrCreate({
        where: { 
          customerAadhaar: item.aadhaar, 
          // staffIdFk: staffData.id 
        },
        defaults: {
          customerName: item.customerName,
          customerMobile: item.mobile,
          joiningDate: item.openingDate ? item.openingDate : null,
          staffIdFk: staffData.id,
          branchIdFk: staffData.branchIdFk,
        }
      });

      // Check if the accountNumber is unique
      const existingAccount = await customerProductTbl.findOne({
        where: { accNumber: item.accountNumber, glCode: item.glCode }
      });

      if (!existingAccount) {
        const leadNo = await getLeadNo(productData.productType);

        const customerProduct = await customerProductTbl.create({
          leadNo,
          glCode: item.glCode,
          accNumber: item.accountNumber,
          accAmount: item.amount,
          customerName: customerData.customerName,
          customerMobile: customerData.customerMobile,
          customerAadhaar: customerData.customerAadhaar,
          openingDate: item.openingDate ? item.openingDate : null,
          maturityDate: item.maturityDate ? item.maturityDate : null,
          maturityAmount: item.maturityAmount,
          productName: item.productName,
          productType: productData.productType,
          remark: item.remark,
          accountType: item.accountType,
          branchIdFk: staffData.branchIdFk,
          productIdFk: productData.id,
          customerIdFk: customerData.id,
          staffIdFk: staffData.id,
        });

        await customerProductTrackingTbl.create({
          remark: 'added by Admin',
          customerProductIdFk: customerProduct.id,
          staffIdFk: staffData.id,
        });
      }
    }

    res.status(201).send('Data saved to database');
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.addCustomerProductFromExcel');
  }
};


customerProductController.getTableExpiredCustomerProduct = async function (req, res) {
  try {
    const { currentPage, perPage, orderBy, orderDirection, searchValue, fromDate, toDate } = req.body
    const perPageRecords = parseInt(perPage)
    const page = parseInt(currentPage)
    let start = page * perPageRecords - perPageRecords

    let whereClause = {
      status: 2,
      [Op.or]: [
        { customerName: { [Op.like]: '%' + searchValue + '%' } }
      ]
    };

    if (fromDate && toDate) {
      whereClause.status = 2;
      whereClause[Op.and] = [
        { createdAt: { [Op.between]: [fromDate, new Date(new Date(toDate).setHours(23, 59, 59, 999))] } }
      ];
    }

    const customerTblResult = await customerProductTbl.findAll({
      where: whereClause,
      include: [
        {
            model: branchTbl,
            as: 'tbl_branch',
        },
        {
            model: staffTbl,
            as: 'tbl_staff',
        }
      ],
      order: [[orderBy, orderDirection]],
      offset: start,
      limit: perPage
    })
    start++
    const tableData = customerTblResult.map((obj, index) => {
        let branchName = '';
        if(obj.get('tbl_branch').length !== 0)
            branchName = obj.get('tbl_branch')[0].get("name");
        let staffName = '';
        if(obj.get('tbl_staff').length !== 0)
            staffName = obj.get('tbl_staff')[0].get("name");
        return {
            srno: start++,
            id: obj.get('id'),
            branchName,
            staffName,
            leadNo: obj.get('leadNo'),
            glCode: obj.get('glCode'),
            accNumber: obj.get('accNumber'),
            accAmount: obj.get('accAmount'),
            renewalAmount: obj.get('renewalAmount'),
            savingAccountNumber: obj.get('savingAccountNumber'),
            customerName: obj.get('customerName'),
            customerMobile: obj.get('customerMobile'),
            customerAadhaar: obj.get('customerAadhaar'),
            openingDate: obj.get('openingDate'),
            maturityDate: obj.get('maturityDate'),
            productName: obj.get('productName'),
            productType: obj.get('productType'),
            comissionAmount: obj.get('comissionAmount'),
            comissionPercentage: obj.get('comissionPercentage'),
            remark: obj.get('remark'),
            comissionStatus: obj.get('comissionStatus'),
            comissionDate: obj.get('comissionDate'),
            comissionMonth: obj.get('comissionMonth'),
            comissionYear: obj.get('comissionYear'),
            comissionAssignedBy: obj.get('comissionAssignedBy'),
            branchIdFk: obj.get('branchIdFk'),
            productIdFk: obj.get('productIdFk'),
            customerIdFk: obj.get('customerIdFk'),
            staffIdFk: obj.get('staffIdFk'),
            status: obj.get('status'),
            exitStatus: obj.get('exitStatus'),
            createdAt: obj.get('createdAt'),
            updatedAt: obj.get('updatedAt')
        }
    })
    const totalRecords = await customerProductTbl.count({
      // where: {
      //   [Op.or]: [
      //     { customerName: { [Op.like]: '%' + searchValue + '%' } }
      //   ]
      // }
      where: whereClause,
    })
    res.status(200).json({ totalRecords, tableData })
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getTableExpiredCustomerProduct')
  }
}

customerProductController.getCustomerProductDetails = async function (req, res) {
  try {
    const { id } = req.body;
    // const customerProductData = await customerProductTbl.findByPk(id)
    const customerProductData = await customerProductTbl.findByPk(id, {
      include: [
        {
          model: branchTbl,
          as: 'tbl_branch',
          attributes: ['name'],
        },
      ],
    });
     
    if(customerProductData){
      res.status(200).json({result : customerProductData})
    } else {
      res.status(201).json('data not found')
    }    
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getCustomerProductDetails')
  }
}

customerProductController.getAllBranchName = async function (req, res) {
  try {
    const materialStdTblResults = await branchTbl.findAll({
      where: {
        status: 1
      },
      order: [['createdAt', 'desc']],
      limit: 50
    })
    const result = materialStdTblResults.map(obj => ({
      label: obj.name,
      value: obj.id,
    }))
      res.status(200).json(result)
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getAllBranchName')
  }
}
  
customerProductController.getBranchNameForSelect = async function (req, res) {
  try {
    const { word } = req.query
    const materialStdTblResults = await branchTbl.findAll({
      where: {
        [Op.and]: [{ status: 1 }],
        [Op.or]: [{ name: { [Op.like]: '%' + word + '%' } }]
      },
      limit: 15
    })
    const result = materialStdTblResults.map(obj => ({
      label: obj.name,
      value: obj.id,
    }))
    res.status(200).json(result)
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.getBranchNameForSelect')
  }
}

customerProductController.updateCustomerProduct = async function (req, res) {
  try {
    const { 
      id,
      customerAadhaar,
      customerName,
      customerMobile,
      glCode,
      accAmount,
      renewalAmount,
      accNumber,
      savingAccountNumber,
      email,
      openingDate,
      maturityDate,
      maturityAmount,
      remark,
      accountType,
      productName,
      productNameId, 
      days,
      branchName,
      branchId 
    } = req.body;

    const customrProdData = await customerProductTbl.findByPk(id);
    
      await customerProductTbl.update({
        customerAadhaar,
        glCode,
        accNumber,
        savingAccountNumber,
        email,
        accAmount,
        renewalAmount: renewalAmount || 0,
        customerName,
        customerMobile,
        openingDate: openingDate ? openingDate : null,
        maturityDate: maturityDate ? maturityDate : null,
        maturityAmount,
        accountType,
        remark,
        days,
        branchIdFk: branchId
      },{ where: { id }}).then(async(obj) => {
        res.status(200).json('data updated')

        await customerTbl.update({
          customerAadhaar,
          customerName,
          customerMobile
        },{ where : { id: customrProdData.customerIdFk}})

        await customerProductTrackingTbl.create({
          remark: 'updated by Admin',
          customerProductIdFk: id,
          userIdFk: req.uid
        })
      }).catch((err)=> {
        handleSequelizeError(err, res, 'customerProductController.updateCustomerProduct')
      })   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.updateCustomerProduct')
  }
}

customerProductController.updateExpiredCustomerProduct = async function (req, res) {
  try {
    const { 
      id,
      customerAadhaar,
      customerName,
      customerMobile,
      glCode,
      accAmount,
      renewalAmount,
      accNumber,
      savingAccountNumber,
      email,
      openingDate,
      maturityDate,
      maturityAmount,
      remark,
      accountType,
      productName,
      productNameId, 
      days,
      branchName,
      branchId 
    } = req.body;

    const customrProdData = await customerProductTbl.findByPk(id);

    const today = new Date();
    const maturity = maturityDate ? new Date(maturityDate) : null;
    const status = maturity && maturity < today ? 2 : 1;
    
      await customerProductTbl.update({
        customerAadhaar,
        glCode,
        accNumber,
        savingAccountNumber,
        email,
        accAmount,
        renewalAmount: renewalAmount || 0,
        customerName,
        customerMobile,
        openingDate: openingDate ? openingDate : null,
        maturityDate: maturityDate ? maturityDate : null,
        maturityAmount,
        accountType,
        remark,
        days,
        branchIdFk: branchId,
        status : status
      },{ where: { id }}).then(async(obj) => {
        res.status(200).json('data updated')

        // await customerTbl.update({
        //   customerAadhaar,
        //   customerName,
        //   customerMobile
        // },{ where : { id: customrProdData.customerIdFk}})

        await customerProductTrackingTbl.create({
          remark: 'updated by Admin from expired customer product',
          customerProductIdFk: id,
          userIdFk: req.uid
        })
      }).catch((err)=> {
        handleSequelizeError(err, res, 'customerProductController.updateExpiredCustomerProduct')
      })   
  } catch (err) {
    handleSequelizeError(err, res, 'customerProductController.updateExpiredCustomerProduct')
  }
}


module.exports = customerProductController
