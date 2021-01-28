const express = require('express');
const router = express.Router();
const path = require("path");
const {TB_COMPANY, TB_BRAND, sequelize, Sequelize} = require("../models");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
let s3 = new AWS.S3();
const {Op} = require("sequelize");
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "scanus-brand",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension);
        },
        acl: "public-read-write",
    }),
});
/*---브랜드관리 페이지 데이터 삽입---*/
router.post('/insert', upload.single("file"), async (req, res) => {
    try {
        const {com_nm, br_nm, br_kinds, br_main, use_yn} = req.body

        const company = await TB_COMPANY.findOne({
            where: {
                com_nm
            },
            attributes: [
                "com_idx"
            ]
        })
        await TB_BRAND.create({
            com_idx: company.dataValues.com_idx,
            br_nm,
            br_kinds,
            br_main,
            br_img: req.file.location,
            use_yn,
            reg_ip: req.ip,
        })
        res.json({
            success: 1
        })
    } catch (error) {
        console.log(error)
    }
})
/*---브랜드관리 페이지 데이터 수정---*/
router.post('/update', upload.single("file"), async (req, res) => {
    try {
        let image;
        const {br_idx, com_nm, br_nm, br_kinds, br_main, use_yn} = req.body
        image = await TB_BRAND.findOne({
            where: {br_idx},
            attributes: ["br_img"]
        })
        if (!req.file) {
            await TB_BRAND.update({
                    br_nm,
                    br_kinds,
                    br_main,
                    use_yn,
                },
                {
                    where: {br_idx}
                }
            )
        }
        if (req.file) {
            const key = image.br_img.split("/");
            await s3.deleteObject(
                {
                    Bucket: "scanus-brand",
                    Key: decodeURI(key[3]),
                },
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
            )
            await TB_BRAND.update({
                    br_nm,
                    br_kinds,
                    br_main,
                    use_yn,
                    br_img: req.file.location,
                },
                {
                    where: {br_idx}
                }
            )
        }
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
/*---브랜드관리 페이지 데이터 sort 수정---*/

router.post('/updateSort', async (req, res) => {
    try {
        const data = req.body
        for (const update of data) {
            await TB_BRAND.update(
                {br_sort: update.br_sort},
                {
                    where: {br_idx: update.br_idx}
                }
            )
        }
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
/*---브랜드관리 페이지 데이터 삭제---*/
router.post('/delete', async (req, res) => {
    try {
        const {br_idx, br_img} = req.body
        await TB_BRAND.destroy({where: {br_idx}})
        if (br_img) {
            const key = br_img.split("/");
            await s3.deleteObject(
                {
                    Bucket: "scanus-brand",
                    Key: decodeURI(key[3]),
                },
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }
            )
        }
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
/*---브랜드관리 페이지 데이터 조회---*/
router.post('/list', async (req, res) => {
    try {
        const {br_main, use_yn, currentPage, postsPerPage, searchField, sort, searchData, kindsFilter} = req.body;
        let list;
        console.log(sort)
        const indexOfLastData = currentPage * postsPerPage;
        const indexOfFirstData = indexOfLastData - postsPerPage;
        if (searchField === "com_nm") {
            list = await TB_BRAND.findAll({
                where: {
                    br_kinds: {[Op.regexp]: `(${kindsFilter.join('|')})`},
                    br_main: {[Op.regexp]: `(${br_main.join('|')})`},
                    use_yn: {[Op.regexp]: `(${use_yn.join('|')})`},
                },
                order: [["br_sort", sort]],
                attributes: [
                    "br_idx",
                    "com_idx",
                    "br_nm",
                    "br_img",
                    "br_main",
                    "br_sort",
                    "use_yn",
                    "br_kinds",
                ],
                include: [
                    {
                        model: TB_COMPANY, where: {
                            [searchField]: searchField,
                            [searchField]: {[Op.like]: "%" + searchData + "%"},
                        }, attributes: ["com_nm"]
                    }
                ]
            })
        }
        if (searchField === "br_nm") {
            list = await TB_BRAND.findAll({
                where: {
                    [searchField]: searchField,
                    [searchField]: {[Op.like]: "%" + searchData + "%"},
                    br_kinds: {[Op.regexp]: `(${kindsFilter.join('|')})`},
                    br_main: {[Op.regexp]: `(${br_main.join('|')})`},
                    use_yn: {[Op.regexp]: `(${use_yn.join('|')})`},

                },
                order: [["br_sort", sort]],
                attributes: [
                    "br_idx",
                    "com_idx",
                    "br_nm",
                    "br_img",
                    "br_main",
                    "br_sort",
                    "use_yn",
                    "br_kinds",
                ],
                include: [
                    {
                        model: TB_COMPANY, where: {}, attributes: ["com_nm"]
                    }
                ]
            })
        }
        if (searchField === "all") {
            list = await TB_BRAND.findAll({
                where: {
                    br_kinds: {[Op.regexp]: `(${kindsFilter.join('|')})`},
                    br_main: {[Op.regexp]: `(${br_main.join('|')})`},
                    use_yn: {[Op.regexp]: `(${use_yn.join('|')})`},
                },
                order: [['br_sort', sort]],
                attributes: [
                    "br_idx",
                    "com_idx",
                    "br_nm",
                    "br_img",
                    "br_main",
                    "br_sort",
                    "use_yn",
                    "br_kinds",
                ],
                include: [
                    {model: TB_COMPANY, attributes: ["com_nm"]}
                ]
            })
        }
        const total = list.length;
        const currentPosts = list.slice(indexOfFirstData, indexOfLastData)
        res.json({list: currentPosts, success: 1, total})
    } catch (error) {
        console.log(error)
    }
})
/*---브랜드관리 ,회사정보 조회---*/
router.post("/companyList", async (req, res) => {
    try {
        let list;
        list = await TB_COMPANY.findAll({
            attributes: [
                "com_nm"
            ]
        })
        res.json({success: 1, list})
    } catch (error) {
        console.log(error)
    }
})
router.post("/updateMain", async (req, res) => {
    try {
        const {br_idx, br_main} = req.body;
        if (br_main === "Y") {
            await TB_BRAND.update(
                {br_main: "N"},
                {
                    where: {br_idx, br_main: "Y"}
                }
            )
        }
        if (br_main === "N") {
            await TB_BRAND.update(
                {br_main: "Y"},
                {
                    where: {br_idx, br_main: "N"}
                }
            )
        }
        res.json({success: 1})

    } catch (error) {
        console.log(error)
    }
})
router.post("/updateUse", async (req, res) => {
    try {
        const {br_idx, use_yn} = req.body;
        console.log(req.body)
        if (use_yn === "Y") {
            await TB_BRAND.update(
                {use_yn: "N"},
                {
                    where: {br_idx, use_yn: "Y"}
                }
            )
        }
        if (use_yn === "N") {
            await TB_BRAND.update(
                {use_yn: "Y"},
                {
                    where: {br_idx, use_yn: "N"}
                }
            )
        }
        res.json({success: 1})
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;



