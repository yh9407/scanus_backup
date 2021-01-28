"use strict"

const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TB_ADMIN",
        {
            admin_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true,
            },
            com_idx: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            admin_id: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            admin_pw: {
                type: DataTypes.STRING(250),
                allowNull: false,
            },
            mn_nm: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            mn_tel: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            mn_email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            admin_type: {
                type: DataTypes.ENUM({
                    values:['M','A']
                }),
                defaultValue:'A',
                allowNull: false,
            },
            con_state: {
                type: DataTypes.ENUM({
                    values:['1','2','3','4']
                }),
                defaultValue:'1',
                allowNull: false,
            },
            con_text: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            tableName: "TB_ADMIN",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            timestamps: false,
            collate: "utf8mb4_general_ci",
        }
    );
};
