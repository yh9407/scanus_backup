"use strict"
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TB_EVENT",
        {
            evt_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            com_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            evt_nm: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            evt_m_img: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            evt_l_img: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            evt_type: {
                type: DataTypes.ENUM({
                    values:['I','U']
                }),
                allowNull: false,
            },
            evt_d_img: {
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            evt_url:{
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            evt_s_dt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            evt_e_dt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            evt_view: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue:0,
            },
            sort: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue:0,
            },
            use_yn: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: 'Y',
            },
            reg_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reg_dt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            reg_ip: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            mod_idx:{
                type: DataTypes.INTEGER,
                allowNull: true,
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
            tableName: "TB_EVENT",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            timestamps: false,
            collate: "utf8mb4_general_ci",
        }
    );
};
