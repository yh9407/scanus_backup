"use strict"

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.TB_ADMIN = require("./user/tb_admin")(sequelize, Sequelize);
db.TB_COMPANY = require("./user/tb_company")(sequelize, Sequelize);
db.TB_BRAND = require("./user/tb_brand")(sequelize, Sequelize);
db.TB_EVENT = require("./event/tb_event")(sequelize, Sequelize);
db.TB_UI_HISTORY = require("./history/tb_ui_history")(sequelize, Sequelize);

db.TB_COMPANY.hasMany(db.TB_ADMIN, {
    foreignKey: "com_idx", sourceKey: "com_idx"})
db.TB_ADMIN.belongsTo(db.TB_COMPANY, {
    foreignKey: "com_idx", targetKey: "com_idx"
})
db.TB_BRAND.belongsTo(db.TB_COMPANY, {
    foreignKey: "com_idx", targetKey: "com_idx"
})
db.TB_EVENT.belongsTo(db.TB_COMPANY, {
    foreignKey: "com_idx", targetKey: "com_idx"
})
module.exports = db;
