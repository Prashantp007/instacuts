const response = require('../helper/response');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const jwt = require('jsonwebtoken')
const {
    serviceProvider,
    serviceProviderAddress,
    serviceProviderDetail,
    serviceProviderImages,
    customServices,
    serviceDay,
    timeSlote,
    sequelize } = require('../models');
const { resolve } = require('path');
const { Certificate } = require('crypto');
const { Op, where } = require('sequelize')
const Sequelize = require('sequelize')

// signUp serviceProvider --------------------
exports.signUpServiceProvider = [
    body("first_name").notEmpty().trim().isString(),
    body("last_name").notEmpty().trim().isString(),
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
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            const findServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            // console.log("aaaaaaaaaaaaaa    ",findServiceProvider);
            if (findServiceProvider != null) {
                fs.unlink('./public/' + req.files[0].filename, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log(`File deleted! : ${req.files[0].filename}`);
                });
                return response.failedResponse(res, "account is already exist ...");
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const serviceProviderPayload = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                DOB: req.body.DOB,
                gender: req.body.gender,
                mobile_number: req.body.mobile_number,
                password: hashedPassword,
                email: req.body.email.toLowerCase(),
                profile_picture: req.files[0].filename,
            };
            // console.log(serviceProviderPayload);

            const createdAccount = await serviceProvider.create(serviceProviderPayload);
            if (!createdAccount)
                return response.failedResponse(res, "couldn't find created Account ...");
            return response.successResponse(res, { msg: "account is created ...", data: createdAccount });


        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// send-Otp serviceProvider ------------------
exports.sendOtpServiceProvider = [
    async function (req, res) {
        try {
            // console.log("aaaaaaaaaaaaaaaaaaaa");
            const findServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            // console.log("bbbbbbbbbbbbbbbbbbbb",findServiceProvider);      

            if (findServiceProvider == null) {
                return response.failedResponse(res, "mobile number not exist ...");
            } else {
                const comPassword = await bcrypt.compare(req.body.password, findServiceProvider.password);
                if (comPassword == false)
                    return response.failedResponse(res, "wrong password ...");
            }
            // console.log("cccccccccccccccccccc",findServiceProvider)
            if (findServiceProvider.is_verify != false)
                return response.failedResponse(res, "account is already verified ...");

            // console.log("yyyyyyyyyyyyyyyyyyyyyysssss")
            await serviceProvider.update({ OTP: Math.floor(Math.random() * 9000 + 1000), }, { where: { mobile_number: req.body.mobile_number } })
            const updatedServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            return response.successResponse(res, { msg: "otp is send to your mobile number ...", data: updatedServiceProvider });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// verification serviceProvider ------------------
exports.verifyServiceProvider = [
    async function (req, res) {
        try {
            // console.log("aaaaaaaaaaaaaaaaaaaa");
            const findServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            // console.log("bbbbbbbbbbbbbbbbbbbb",findServiceProvider);      

            if (findServiceProvider == null) {
                return response.failedResponse(res, "mobile number not exist ...");
            } else {
                const comPassword = await bcrypt.compare(req.body.password, findServiceProvider.password);
                if (comPassword == false)
                    return response.failedResponse(res, "wrong password ...");
            }
            // console.log("cccccccccccccccccccc",findServiceProvider)
            if (findServiceProvider.is_verify != false)
                return response.failedResponse(res, "account is already verified ...");
            if (findServiceProvider.OTP != req.body.OTP)
                return response.failedResponse(res, "OTP doesn't match ...")
            // console.log("yyyyyyyyyyyyyyyyyyyyyysssss")
            await serviceProvider.update({ is_verify: true }, { where: { mobile_number: req.body.mobile_number } })
            const updatedServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            return response.successResponse(res, { msg: "now account is verified", data: updatedServiceProvider });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// singIN serviceProvider -------------------
exports.signInServicreProvider = [
    async function (req, res) {
        try {
            const findAccount = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number } });
            // console.log("aaaaaaaaaaaaaaaaaaaaaaa     :",findAccount)
            if (findAccount == null)
                return response.failedResponse(res, "mobile no. not exist ...");
            const comparePassword = await bcrypt.compare(req.body.password, findAccount.password);
            if (!comparePassword)
                return response.failedResponseStatus(res, 401, "password is wrong ...")
            // console.log("next......")
            if (findAccount.is_verify == false)
                return response.failedResponse(res, "account is not verified ...");
            const showSign_inServiceProvider = await serviceProvider.findOne({ where: { mobile_number: req.body.mobile_number }, attributes: ['first_name', 'last_name'] });
            const genToken = jwt.sign({ id: findAccount.id }, process.env.JWT);
            // console.log("token.........: ",genToken);
            const token = genToken ? genToken : "";
            if (!genToken)
                return response.failedResponse(res, "token couldn't create ...")
            return response.successResponse(res, { msg: "sign in successfully ...", detail: showSign_inServiceProvider, token: token });


        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]

// add serviceProviderAddress ---------------
exports.addServiceProviderAddress = [
    async function (req, res) {
        try {
            const findAddress = await serviceProviderAddress.findOne({ where: { serviceProvider_id: req.user.id } });
            // console.log(findAddress)
            if (findAddress != null)
                return response.failedResponse(res, "Address already exist ...");
            const addressPayload = {
                serviceProvider_id: req.user.id,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            };
            // console.log(addressPayload);

            const createdAddress = await serviceProviderAddress.create(addressPayload);
            return response.successResponse(res, { msg: "address is added ...", data: createdAddress });

            // console.log("dddddddddddssssssssssssssssd")
            // console.log("dddddddddddd",req.body,req.user.id)
        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// add serviceProviderDetail ---------------
exports.addServiceProviderDetail = [
    async function (req, res) {
        try {
            const findAddress = await serviceProviderDetail.findOne({ where: { serviceProvider_id: req.user.id } });
            // console.log(findAddress)
            if (findAddress != null)
                return response.failedResponse(res, "detail already exist ...");
            const addressPayload = {
                serviceProvider_id: req.user.id,
                serviceCategory: req.body.serviceCategory,
                specification: req.body.specification,
                experience: req.body.experience,
                SSN_number: req.body.SSN_number,
                cosmetologyLicense: req.body.cosmetologyLicense,
                drivingLicense: req.body.drivingLicense
            };
            // console.log(addressPayload);

            const createdDetail = await serviceProviderDetail.create(addressPayload);
            return response.successResponse(res, { msg: "detail is added ...", data: createdDetail });

            // console.log("dddddddddddssssssssssssssssd")
            // console.log("dddddddddddd",req.body,req.user.id)
        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// add serviceProvider Personalize Detail ---------------
exports.addServiceProviderPersonalizeDetail = [
    async function (req, res) {
        try {
            const findDetail = await serviceProviderDetail.findOne({ where: { serviceProvider_id: req.user.id } });
            // console.log(findDetail)
            if (findDetail == null)
                return response.failedResponse(res, "details are not exist ...");

            const detailPayload = {
                about_me: req.body.about_me,
                languages: req.body.languages,
                skills: req.body.skills,
                portfolio: req.body.portfolio,
                set_work_radios: req.body.set_work_radios,
            };
            // console.log(detailPayload);

            await serviceProviderDetail.update(detailPayload, { where: { serviceProvider_id: req.user.id } });
            const createdDetail = await serviceProviderDetail.findOne({ where: { serviceProvider_id: req.user.id } });
            return response.successResponse(res, { msg: "extra detail is added ...", data: createdDetail });

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// add ServiceProvider photos ---------------
exports.addServiceProviderPictures = [
    async function (req, res) {
        try {
            const findAddress = await serviceProviderDetail.findOne({ where: { serviceProvider_id: req.user.id } });
            console.log(findAddress)
            if (findAddress == null)
                return response.failedResponse(res, "details are not exist ...");

            const checkPhotos = await serviceProviderImages.findOne({ where: { serviceProvider_id: req.user.id } });
            if (checkPhotos != null) {
                for (let i = 0; i < req.files.length; i++) {
                    fs.unlink('./public/' + req.files[i].filename, function (err) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        console.log(`File deleted! : ${req.files[i].filename}`);
                    });
                }
                return response.failedResponse(res, "photos already added ...")
            }
            // console.log(req.files.length);
            for (let i = 0; i < req.files.length; i++) {
                let imagesPayload = {
                    serviceProvider_id: req.user.id,
                    images: req.files[i].filename
                }
                await serviceProviderImages.create(imagesPayload);
            }
            const addPictures = await serviceProviderImages.findAll({ where: { serviceProvider_id: req.user.id } });
            return response.successResponse(res, { msg: `${req.files.length}  pictures are added ...`, data: addPictures });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// show all details ---------------------
exports.showAllDetails = [
    async function (req, res) {
        try {
            const findDetail = await serviceProvider.findAll({
                where: { id: req.user.id }, attributes: { exclude: ['OTP', 'password'] }, include: [{
                    model: serviceProviderAddress,
                    // where: { serviceProvider_id: req.user.id }
                }, {
                    model: serviceProviderDetail,
                    as: 'detail',
                    // where: { serviceProvider_id: req.user.id }
                }, {
                    model: serviceProviderImages,
                    // where: { serviceProvider_id: req.user.id }
                }]
            },

            )
            return response.successResponse(res, findDetail)
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]



// ------------------------------------- services ---------------------------------------

// create custom service -----------------
exports.createCustomService = [
    async function (req, res) {
        try {
            const findServices = await customServices.findOne({ where: { serviceProvider_id: req.user.id, category: req.body.category, availableFor: req.body.availableFor } });
            console.log("============>>>>>>>>>>>>>> ", findServices);
            if (findServices != null)
                return response.failedResponse(res, "custom service alredy exist ...")
            console.log("111111111111111111111")
            // return
            const customServicesPayload = {
                serviceProvider_id: req.user.id,
                titel: req.body.titel,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                availableFor: req.body.availableFor
            }
            console.log(customServicesPayload);
            const createService = await customServices.create(customServicesPayload);
            if (!createService)
                return response.failedResponse(res, "couldnot create services ...")
            return response.successResponse(res, { msg: "service created ...", data: createService })

        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// delete custom service --------------------
exports.deleteCustomService = [
    async function (req, res) {
        try {
            // console.log("Ddddddddddddddddddddddddddddddddddddd");
            const findCustomServices = await customServices.findOne({ where: { serviceProvider_id: req.user.id, category: req.body.category } })
            if (findCustomServices == null)
                return response.failedResponse(res, "custom service not found");
            const deleteCustomServices = await customServices.destroy({ where: { erviceProvider_id: req.user.id, category: req.body.category } })
            if (!deleteCustomServices)
                return response.failedResponse(res, "service couldnot deleted ...")
            return response.successResponse(res, { msg: "service deleted ...", data: findCustomServices });

        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// add shadule --------------------
exports.setSchedule = [
    body("slot_to").notEmpty(),
    body("slot_from").notEmpty(),
    async function (req, res) {

        try {
            // console.log("Ddddddddddddddddddddddddddddddddddddd\n");
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            let requestBody = req.body;
            console.log("RequestData =======>>>>>>>>>", req.user.id, requestBody.day, requestBody.slot_to, requestBody.slot_from);

            const findDay = await serviceDay.findOne({ where: { serviceProvider_id: req.user.id, day: req.body.day } });
            let dayId;
            let day;
            if (findDay == null) {
                const payload = {
                    serviceProvider_id: req.user.id,
                    day: req.body.day
                }
                const createDay = await serviceDay.create(payload)
                dayId = createDay.id;
                day = createDay.day;
                // console.log("===============>>>>>>>>>>",day)
            } else {
                dayId = findDay.id;
            }
            // console.log("============>>>>>>>>", dayId);
            const findTimeSlote = await timeSlote.findOne({
                where: {
                    day_id: dayId,
                    //  slot_to:{[Op.lte]:req.body.slot_to},
                    [Op.or]: [{
                        [Op.and]: [{ slot_to: { [Op.lte]: req.body.slot_to } },
                        { slot_from: { [Op.gte]: req.body.slot_to } }]
                    },
                    {
                        [Op.and]: [{ slot_to: { [Op.lte]: req.body.slot_from } },
                        { slot_from: { [Op.gte]: req.body.slot_from } }]
                    }]
                }
            });
            // console.log("===========>>>>>>>>>>>>>>", findTimeSlote)
            if (findTimeSlote != null)
                return response.failedResponse(res, "slot timing matched ...");

            let slotPayload = {
                day_id: dayId,
                slot_to: req.body.slot_to,
                slot_from: req.body.slot_from
            }
            console.log(slotPayload)

            const createSlot = await timeSlote.create(slotPayload);
            if (!createSlot)
                return response.failedResponse(res, "timeSlot couldn't created ...")

            return response.successResponse(res, { msg: "schedule is created ...", data: { day: day, slot: createSlot } })



        } catch (err) {
            return response.failedResponse(res, err.message);
        }
    }
]