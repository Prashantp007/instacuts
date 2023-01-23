const response = require("../helper/response");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
// const model = require("../models");
// const clientDetail = model.clientDetail;
// const clientAddress = model.clientAddress;
const { clientDetail, clientAddress } = require("../models");
const jwt = require("jsonwebtoken");
const fs = require('fs')

// sign up client account ---------------------
exports.signUpClient = [
    body("first_name").notEmpty().trim().isString(),
    body("last_name").notEmpty().trim().isString(),
    // body("mobile_number").notEmpty().trim().isLength({ min: 10, max:10}),
    body("email")
        .isEmail()
        .normalizeEmail()
        .trim()
        .withMessage("please enter valid email ..."),
    body("mobile_number")
        .notEmpty()
        .trim()
        .matches("(?=.*[0-9])")
        .isLength({ min: 10, max: 10 })
        .withMessage("mobile no. takes only 10 characters ..."),
    body("password")
        .isLength({ min: 8 })
        .notEmpty()
        .withMessage("Password must be at least 8 characters ..."),
    // .matches('(?=.*[a-z])(?=.*[0-9])')

    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());
            // error1: errors.array()[0]["msg"],

            firstName = req.body.first_name.charAt(0).toUpperCase() + req.body.first_name.slice(1).toLowerCase();
            lastName = req.body.last_name.charAt(0).toUpperCase() + req.body.last_name.slice(1).toLowerCase();
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // console.log(req.files[0].filename);
            //   console.log(hashedPassword);
            const findAcc = await clientDetail.findOne({
                where: { mobile_number: req.body.mobile_number },
            });
            if (findAcc) {
                fs.unlink('./public/'+req.files[0].filename, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
                // console.log("yyyyyyyyyyyyyyy");
                return response.failedResponse(res, "account is allready exist ...");
            } else {
                // console.log("nooooooooooooooooooo");
                const payload = {
                    first_name: firstName,
                    last_name: lastName,
                    email: req.body.email.toLowerCase(),
                    mobile_number: req.body.mobile_number,
                    password: hashedPassword,
                    DOB: req.body.DOB,
                    gender: req.body.gender,
                    profile_picture: req.files[0].filename,
                };
                // console.log("======>>>>>>>", payload);
                
                const findCreatedAcc = await clientDetail.create(payload);
                return response.successResponse(res, { msg: "account is created ...", data: findCreatedAcc, });

                //   const detail = await clientDetail.();
                //   return response.successResponse(res, detail)
            }
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    },
];
// send-Otp client ------------------
exports.sendOtpclient = [
    async function (req, res) {
        try {
            // console.log("aaaaaaaaaaaaaaaaaaaa");
            const findclient = await clientDetail.findOne({ where: { mobile_number: req.body.mobile_number } });
            // console.log("bbbbbbbbbbbbbbbbbbbb",findServiceProvider);      

            if (findclient == null) {
                return response.failedResponse(res, "mobile number not exist ...");
            } else {
                const comPassword = await bcrypt.compare(req.body.password, findclient.password);
                if (comPassword == false)
                    return response.failedResponse(res, "wrong password ...");
            }
            // console.log("cccccccccccccccccccc",findclient)
            if (findclient.is_verify != false)
                return response.failedResponse(res, "account is already verified ...");

            // console.log("yyyyyyyyyyyyyyyyyyyyyysssss")
            await findclient.update({ OTP: Math.floor(Math.random() * 9000 + 1000), }, { where: { mobile_number: req.body.mobile_number } })
            const updatedClient = await clientDetail.findOne({ where: { mobile_number: req.body.mobile_number } });
            return response.successResponse(res, { msg: "otp is send to your mobile number ...", data: updatedClient });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// client account verification ----------------
exports.clientAccountVerification = [
    body("OTP").notEmpty().isLength({ min: 4, max: 4 }).withMessage("please enter 4 digit OTP ..."),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            // console.log("dddddddddddddddddd");
            const checkAccVerification = await clientDetail.findOne({
                where: { mobile_number: req.body.mobile_number },
            });
            if (!checkAccVerification) {
                return response.failedResponse(res, "account is not valid ...");
            } else {
                const comparePassword = await bcrypt.compare(req.body.password, checkAccVerification.password);
                // console.log("dddddddddd", comparePassword);
                if (comparePassword == false) return response.failedResponse(res, "password doesn't match ...");
                // console.log(req.body.OTP,".......... otp ..........",checkAccVerification.OTP);
                if (checkAccVerification.OTP != req.body.OTP) {
                    return response.failedResponse(res, "OTP is not valid ...");
                } else {
                    // console.log("otp is matched ....");
                    if (checkAccVerification.is_verify == true)
                        return response.failedResponse(res, "account is already verified ...");

                    // clientUpdateVerification --------------------
                    await clientDetail.update({ is_verify: true }, {
                        where: { mobile_number: req.body.mobile_number }
                    }
                    );
                    return response.successResponse(res, "Your account is verified now ...");
                }
            }
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    },
];
// sign in client account -------------------
exports.signInClient = [
    async function (req, res) {
        try {
            // console.log("jwt.................",process.env.JWT);
            const sign_inClient = await clientDetail.findOne({ where: { mobile_number: req.query.mobile_number } },);
            if (sign_inClient == null)
                return response.failedResponse(res, "mobile no. not exist ...");
            const comparePassword = await bcrypt.compare(req.query.password, sign_inClient.password);
            if (!comparePassword)
                return response.failedResponseStatus(res, 401, "password is wrong ...")
            // console.log(comparePassword);
            if (sign_inClient.is_verify != true)
                return response.failedResponse(res, "account is not verified ...")
            const showSign_inClient = await clientDetail.findOne({ where: { mobile_number: req.query.mobile_number }, attributes: ['first_name', 'last_name'] });
            const genToken =  jwt.sign({id:sign_inClient.id}, process.env.JWT);
            // console.log("aaaaaaaaaaaaaaaaaaaaa:   ",sign_inClient.id)
            const token = genToken ? genToken: "";
            if(!genToken)
                return response.failedResponse(res, "token couldn't create ...")
            return response.successResponse(res, { msg: "sign in successfully ...", detail: showSign_inClient , token: token});


            // console.log(sign_inClient);
        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// add client address ----------------------
exports.addClientAddress = [
    body("mobile_number").notEmpty().trim(),
    body("latitude").notEmpty().trim(),
    body("longitude").notEmpty().trim(),
    body("location").notEmpty().trim(),
    body("password").isLength({ min: 8 }).notEmpty().withMessage("Password must be at least 8 characters ..."),

    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, { error: errors.array() });

            const findAcc = await clientDetail.findOne({
                where: { mobile_number: req.body.mobile_number },
            });

            if (!findAcc) {
                return response.failedResponse(res, "mobile no. is not exist ...");
            } else {
                const comparePassword = await bcrypt.compare(req.body.password, findAcc.password);
                if (comparePassword == false) {
                    return response.failedResponse(res, "password doesn't match ...");
                } else {
                    // console.log("dddddddddddddddddddddddddddddddd", findAcc.mobile_number, "    ", comparePassword);
                    // console.log("verify...........", findAcc.is_verify);
                    if (findAcc.is_verify == false)
                        return response.successResponse(res, "account is not verified ...");

                    const findClientAddress = await clientAddress.findOne({
                        where: { client_id: findAcc.id, from: req.body.from },
                    });
                    console.log("..........", findClientAddress);
                    if (findClientAddress != null)
                        return response.failedResponse(res, {
                            msg: "address is already store ...",
                            from: findClientAddress.from,
                        });
                    const payload = {
                        client_id: findAcc.id,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        location: req.body.location,
                        from: req.body.from
                    };
                    // console.log("payload :  ",payload)
                    
                    const createdClientAddress = await clientAddress.create(payload);
                    if (!createdClientAddress)
                        return response.failedResponse(res, "couldnot show address ...");
                    else
                        return response.successResponse(res, createdClientAddress);
                }
            }
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    },
];
// show client address -------------------
exports.showClientAddress = [
    async function (req, res) {
        try {
            
            const checkAccVerification = await clientDetail.findOne({where:{id:req.user.id}});
            console.log(checkAccVerification.is_verify); 
            if (checkAccVerification.is_verify != true)
                return response.failedResponse(res, "account is not verified ...")

            const showClientAddress = await clientAddress.findAll({ where: { client_id: req.user.id } });
            // console.log(showClientAddress);
            if (showClientAddress.length == 0)
                return response.failedResponse(res, "user not showing...");            
            return response.successResponse(res, showClientAddress);

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// remove client address -------------------
exports.removeClientAddress = [
    async function (req, res) {
        try {
            
            const checkAccVerification = await clientDetail.findOne({where:{id:req.user.id}});
            console.log(checkAccVerification.is_verify); 
            if (checkAccVerification.is_verify != true)
                return response.failedResponse(res, "account is not verified ...")

                const showClientRemoveAddress = await clientAddress.findOne({ where: { client_id: req.user.id , from:req.body.from} });
                if(!showClientRemoveAddress)
                    return response.failedResponseStatus(res, 401,`${req.body.from} address not found ...`)
                await clientAddress.destroy({ where: { client_id: req.user.id , from:req.body.from} });
                // console.log(showClientAddress);
                return response.failedResponse(res, showClientRemoveAddress);
           

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]