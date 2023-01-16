const response = require('../helper/response');
const { serviceProvider, serviceProviderAddress, serviceProviderDetail } = require('../models');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fs = require('fs');


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
                fs.unlink('./public/'+req.files[0].filename, function (err) {
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
                email: req.body.email,
                profile_picture: req.files[0].filename,
                OTP: Math.floor(Math.random() * 9000 + 1000),
            };
            // console.log(serviceProviderPayload);
            await serviceProvider.create(serviceProviderPayload);
            const createdAccount = await serviceProvider.findOne({ Where: { mobile_number: req.body.mobile_number } });
            if (!createdAccount)
                return response.failedResponse(res, "couldn't find created Account ...");
            return response.successResponse(res, { msg: "account is created ...", data: createdAccount });


        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]