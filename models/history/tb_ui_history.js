"use strict"

const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "TB_UI_HISTORY",
        {
            data_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true,
            },
            his_type:{
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            note: {
                type: DataTypes.STRING(250),
                allowNull: true,
            },
            reg_idx:{
                type: DataTypes.INTEGER,
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
        },
        {
            tableName: "TB_UI_HISTORY",
            freezeTableName: true,
            underscored: true,
            charset: "utf8mb4",
            timestamps: false,
            collate: "utf8mb4_general_ci",
        }
    );
};
