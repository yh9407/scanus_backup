const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {TB_ADMIN, TB_COMPANY, sequelize, Sequelize} = require("../models");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const {encrypt} = require("../common");
const moment = require("moment")
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
let s3 = new AWS.S3();
const {Op} = require("sequelize");
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "blockey-business-registration",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension);
        },
        acl: "public-read-write",
    }),
});


/* GET users listing. */
router.post('/register_step1', async (req, res) => {
    const {admin_id, admin_pw} = req.body
    const regId = /^[a-zA-z]\w{5,29}$/;
    const regPassword = /^(?=.*?[A-Z])(?=(.*[a-z])+)(?=(.*[\d])+)(?=(.*[\W])+)(?!.*\s).{8,30}$/;
    try {
        const exUser = await TB_ADMIN.findOne({where: {admin_id}})
        //id 중복
        if (exUser) {
            return res.json({
                failure: 2,
                code: 0,
            });
        }
        //id 형식 오류
        if (!regId.test(admin_id)) {
            return res.json({
                failure: 2,
                code: 1,
            })
        }
        // admin_pw 형식 오류
        if (!regPassword.test(admin_pw)) {
            return res.json({
                failure: 2,
                code: 2,
            })
        }
        return res.json({
            success: 1
        })
    } catch (error) {
        console.log(error)
    }
})
router.post('/register', upload.single("file"), async (req, res) => {
    console.log(req.body)
    let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const {admin_id, admin_pw, com_nm, com_no, com_addr, mn_nm, mn_tel, mn_email, com_cd} = req.body;
    const checkComNo = (value) => {

        let checkID = [1, 3, 7, 1, 3, 7, 1, 3, 5, 1];
        let i, chkSum = 0, c2, remander;
        value = value.replace(/-/gi, '');

        for (i = 0; i <= 7; i++) chkSum += checkID[i] * value.charAt(i);
        c2 = "0" + (checkID[8] * value.charAt(8));
        c2 = c2.substring(c2.length - 2, c2.length);
        chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
        remander = (10 - (chkSum % 10)) % 10;
        if (Math.floor(value.charAt(9)) === remander) return true;
        return false;
    }
    try {
        const hash = await bcrypt.hash(admin_pw, 12);
        console.log(hash)

        if (!checkComNo(com_no)) {
            res.json({
                failure: 1,
                code: 8,
            })
        }
        if (!regEmail.test(mn_email)) {
            return res.json({
                failure: 1,
                code: 9,
            })
        }
        const company = await TB_COMPANY.create({
            com_nm,
            com_cd,
            com_no,
            com_img: req.file.location,
            com_addr,
            reg_ip: req.ip,
        })
        await TB_ADMIN.create({
            admin_id,
            admin_pw: hash,
            mn_nm,
            mn_tel,
            mn_email,
            com_idx: company.dataValues.com_idx,
            reg_ip: req.ip,
        })

        res.json({
            success: 1
        })

    } catch (error) {
console.log(error)
    }
})
router.post('/login', async (req, res) => {
    const {admin_id, admin_pw} = req.body
    try {
        await TB_ADMIN.findOne({where: {admin_id}}).then((user) => {
            if (!user) {
                return res.json({
                    failure: 1,
                    code: 2,
                });
            }
            bcrypt.compare(admin_pw, user.admin_pw).then((isMatched) => {
                if (!isMatched) {
                    return res.json({
                        failure: 1,
                        code: 3,
                    })
                } else {
                    return res.json({
                        success: 1,
                    });
                }
            })
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({failure: 3})

    }
});

router.post('/list', async (req, res) => {
    try {
        const {searchData, dateFilter, currentPage, postsPerPage, startDate, endDate, searchField, stateFilter} = req.body
        let list;
        const indexOfLastData = currentPage * postsPerPage;
        const indexOfFirstData = indexOfLastData - postsPerPage;

        if (searchField === "mn_email" || searchField === "mn_nm" || searchField === "mn_tel" || searchField === "admin_id") {
            list = await TB_ADMIN.findAll({
                where: {

                    [searchField]: searchField,
                    [searchField]: {[Op.like]: "%" + searchData + "%"},
                    con_state: {[Op.regexp]: `(${stateFilter.join('|')})`},
                    reg_dt: {
                        [Op.between]: [moment(startDate, "YY/MM/DD HH:mm:ss"), moment(endDate, 'YY/MM/DD HH:mm:ss')]
                    }
                },
                order: [['reg_dt', dateFilter]],
                attributes: [
                    "admin_idx",
                    "admin_id",
                    "mn_nm",
                    "mn_tel",
                    "mn_email",
                    "reg_dt",
                    "mod_dt",
                    "con_text",
                    "con_state",
                ],
                include: [
                    {model: TB_COMPANY, attributes: ["com_nm", "com_no", "com_img", "com_addr"]}
                ],
            });
        }

        if (searchField === "com_nm" || searchField === "com_no" || searchField === "com_addr") {
            list = await TB_ADMIN.findAll({
                where: {
                    con_state: {[Op.regexp]: `(${stateFilter.join('|')})`},
                    reg_dt: {
                        [Op.between]: [moment(startDate, "YY/MM/DD HH:mm:ss"), moment(endDate, 'YY/MM/DD HH:mm:ss')]
                    }
                },
                order: [['reg_dt', dateFilter]],
                attributes: [
                    "admin_idx",
                    "admin_id",
                    "mn_nm",
                    "mn_tel",
                    "mn_email",
                    "reg_dt",
                    "mod_dt",
                    "con_text",
                    "con_state",
                ],
                include: [
                    {
                        model: TB_COMPANY, where: {
                            [searchField]: searchField,
                            [searchField]: {[Op.like]: "%" + searchData + "%"},
                        }, attributes: ["com_nm", "com_no", "com_img", "com_addr"]
                    }
                ],
            });
        }
        if (searchField === "all") {
            list = await TB_ADMIN.findAll({
                where: {
                    con_state: {[Op.regexp]: `(${stateFilter.join('|')})`},
                    reg_dt: {
                        [Op.between]: [moment(startDate, "YY/MM/DD HH:mm:ss"), moment(endDate, 'YY/MM/DD HH:mm:ss')]
                    }
                },
                order: [['reg_dt', dateFilter]],
                attributes: [
                    "admin_idx",
                    "admin_id",
                    "mn_nm",
                    "mn_tel",
                    "mn_email",
                    "reg_dt",
                    "mod_dt",
                    "con_text",
                    "con_state",
                ],
                include: [
                    {model: TB_COMPANY, attributes: ["com_nm", "com_no", "com_img", "com_addr"]}
                ],
            });
        }
        const total = list.length;
        const currentPosts = list.slice(indexOfFirstData, indexOfLastData)
        res.json({list: currentPosts, success: 1, total})
    } catch (error) {
        console.error(error);
        res.status(400).json({failure: 3})
    }
})
router.post('/state', async (req, res) => {
    try {
        const {admin_idx, status, text} = req.body;
        console.log(req.body)
        if (status === "3") {
            for (const ids of admin_idx) {
                await TB_ADMIN.update(
                    {con_state: status, con_text: text},
                    {
                        where: {admin_idx: ids, con_state: "1"},
                    },
                )
            }
        } else {
            for (const ids of req.body) {
                await TB_ADMIN.update(
                    {con_state: "2"},
                    {
                        where: {admin_idx: ids, con_state: "1"},
                    },
                )
            }
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({failure: 3})
    }
})
router.post("/state2", async (req, res) => {
    try {
        const {con_state, admin_idx} = req.body;
        if (con_state === "2") {
            await TB_ADMIN.update(
                {con_state: "4"},
                {
                    where: {admin_idx, con_state: "2"}
                }
            )
        }
        if (con_state === "4") {
            await TB_ADMIN.update(
                {con_state: "2"},
                {
                    where: {admin_idx, con_state: "4"}
                }
            )
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
