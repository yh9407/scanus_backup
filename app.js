"use strict"
const express = require('express');
const path = require('path');
require("dotenv").config();
require("cors")();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const models = require("./models")

// sequelize MariaDB 연결
models.sequelize.sync()
    .then(() => {
        console.log("✓ DB 연결 성공");
    })
    .catch((err) => {
        console.log("✗ DB 연결 에러");
        console.error(err);
        process.exit();
    });

// Router 설정
const usersRouter = require('./routes/users');
const memberRouter = require('./routes/member')
const brandRouter = require('./routes/brand')
const eventRouter = require('./routes/event')
// Router 사용
app.use('/users', usersRouter);
app.use('/member', memberRouter);
app.use('/brand', brandRouter);
app.use('/event', eventRouter);


app.use((req, res) => {
    new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
});
app.listen(process.env.PORT, () =>
    console.log(`${process.env.PORT} port is listening...`)
);

module.exports = app;
