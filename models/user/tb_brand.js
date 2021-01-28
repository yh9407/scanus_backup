"use strict"
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TB_BRAND",
        {
            br_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            com_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            br_nm: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            br_img: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            br_main: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: 'N',
            },
            br_sort: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            use_yn: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: 'Y',
            },
            br_kinds:{
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            reg_dt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            reg_ip: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            mod_dt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            mod_ip: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            tableName: "TB_BRAND",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            timestamps: false,
            collate: "utf8mb4_general_ci",
        }
    );
};
