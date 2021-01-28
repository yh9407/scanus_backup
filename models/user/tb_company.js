"use strict"
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TB_COMPANY",
        {
            com_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            com_nm: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            com_cd: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            com_no: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            com_img: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            com_addr: {
                type: DataTypes.STRING(250),
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
            tableName: "TB_COMPANY",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            timestamps: false,
            collate: "utf8mb4_general_ci",
        }
    );
};
