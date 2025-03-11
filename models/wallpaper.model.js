'use strict'
module.exports = (sequelize, DataTypes) => {
  // noinspection JSUnresolvedFunction,JSUnresolvedVariable
  const wallpaperTbl = sequelize.define(
    'tbl_wallpaper',
    {
      id: {
        field: 'wallpaper_id_pk',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Auto generated key'
      },
      pageURL: {
        field: 'page_url',
        type: DataTypes.STRING(255),
        comment: 'page url to redirect when click on image or video'
      },
      large: {
        field: 'large',
        type: DataTypes.STRING(255),
        comment: 'large image or video'
      },
      medium: {
        field: 'medium',
        type: DataTypes.STRING(255),
        comment: 'medium image or video'
      },
      small: {
        field: 'small',
        type: DataTypes.STRING(255),
        comment: 'small image or video'
      },
      tiny: {
        field: 'tiny',
        type: DataTypes.STRING(255),
        comment: 'tiny image or video'
      },
      userName: {
        field: 'user_name',
        type: DataTypes.STRING(50),
        comment: 'user of image or video'
      },
      isCurrent: {
        field: 'is_current',
        type: DataTypes.TINYINT,
        comment: 'is current image or video, 1 => current, 2 => next, 3 => next, 0 => invalid, -1 => previous, -2 => previous, -3 => previous'
      }
    },
    {}
  )
  // noinspection JSUnusedLocalSymbols
  wallpaperTbl.associate = function (models) {
    // associations can be defined here
  }
  return wallpaperTbl
}
