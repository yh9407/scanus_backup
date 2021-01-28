const express = require('express');
const router = express.Router();
const {TB_COMPANY, TB_EVENT, sequelize, Sequelize} = require("../models");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
let s3 = new AWS.S3();
const {Op} = require("sequelize");
const moment = require("moment")
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "scanus-event",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + file.originalname);
        },
        acl: "public-read-write",
    }),
});
router.post('/insert', upload.array("files"), async (req, res) => {
    try {
        const {com_nm, evt_nm, evt_s_dt, evt_e_dt, use_yn} = req.body
        const company = await TB_COMPANY.findOne({
            where: {
                com_nm
            },
            attributes: [
                "com_idx"
            ]
        })
        await TB_EVENT.create({
            com_idx: company.dataValues.com_idx,
            com_nm,
            evt_nm,
            evt_s_dt: moment(evt_s_dt, "YY/MM/DD HH:mm:ss"),
            evt_e_dt: moment(evt_e_dt, "YY/MM/DD HH:mm:ss"),
            reg_idx: 1,
            evt_type: "I",
            evt_m_img: req.files[0].location,
            evt_l_img: req.files[1].location,
            evt_d_img: req.files[2].location,
            reg_ip: req.ip,
            use_yn,
        })
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
router.post('/update', async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
    }
})
router.post('/updateSort', async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
    }
})
router.post('/delete', async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
    }
})
router.post('/sort', async (req, res) => {
    try {
        const data = req.body
        for (const update of data) {
            await TB_EVENT.update(
                {sort: update.sort},
                {
                    where: {evt_idx: update.evt_idx}
                }
            )
        }
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
router.post('/list', async (req, res) => {
    try {
        const {
            br_main, use_yn, currentPage,
            postsPerPage, searchField, sort,sort_order,
            searchData, kindsFilter,type,reg_dt,evt_s_dt,
            startDate,endDate,
        } = req.body;
        let list;
        const indexOfLastData = currentPage * postsPerPage;
        const indexOfFirstData = indexOfLastData - postsPerPage;
        if (searchField === "all") {
            list = await TB_EVENT.findAll({
                where: {
                        evt_type:{[Op.regexp]: `(${type.join('|')})`},
                        use_yn:{[Op.regexp]: `(${use_yn.join('|')})`},
                    reg_dt:{
                        [Op.between]: [moment(startDate, "YY/MM/DD HH:mm:ss"), moment(endDate, 'YY/MM/DD HH:mm:ss')]
                    }
                },

                order:
                    [[`${sort}`,sort_order]]
                ,
                attributes: [
                    "evt_idx",
                    "com_idx",
                    "evt_nm",
                    "evt_m_img",
                    "evt_l_img",
                    "evt_d_img",
                    "evt_type",
                    "evt_url",
                    "evt_s_dt",
                    "evt_e_dt",
                    "evt_view",
                    "sort",
                    "use_yn",
                    "reg_idx",
                    "reg_dt",
                    "mod_dt",
                    "mod_idx",
                ],
                include: [
                    {
                        model: TB_COMPANY, where: {}, attributes: ["com_nm"]
                    }
                ]
            })
        }

        const total = list.length;
        const currentPosts = list.slice(indexOfFirstData, indexOfLastData)
        res.json({success: 1, total: total, list: currentPosts})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
