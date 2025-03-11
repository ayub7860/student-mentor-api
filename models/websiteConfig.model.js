'use strict'
module.exports = (sequelize, DataTypes) => {
  // noinspection JSUnresolvedFunction,JSUnresolvedVariable
  const websiteConfigTbl = sequelize.define(
    'tbl_website_config',
    {
      id: {
        field: 'website_config_id_pk',
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Auto generated key'
      },
      leadCounterSaving: {
        field: 'lead_counter_Saving',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter Saving'
      },
      leadCounterCurrent: {
        field: 'lead_counter_current',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter current'
      },
      leadCounterPigmy: {
        field: 'lead_counter_pigmy',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter pigmy'
      },
      leadCounterFd: {
        field: 'lead_counter_fd',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter fd'
      },
      leadCounterLoan: {
        field: 'lead_counter_loan',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter loan'
      },
      leadCounterRD: {
        field: 'lead_counter_rd',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter rd'
      },
      leadCounterRecovery: {
        field: 'lead_counter_recovery',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'lead counter recovery'
      },
      documentUploadCounter: {
        field: 'document_upload_counter',
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'document upload counter'
      },
    },
    {}
  )
  // noinspection JSUnusedLocalSymbols
  websiteConfigTbl.associate = function (models) {
    // associations can be defined here
  }
  return websiteConfigTbl
}
