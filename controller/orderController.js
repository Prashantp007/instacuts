const { Op, where, QueryInterface } = require('sequelize');
const db = require('../models/index');
const sequelize = db.sequelize;
const response = require('../helper/response');
const { body, validationResult, param } = require('express-validator');
const moment = require('moment')
const { clientDetail,
    clientAddress,
    serviceProvider,
    serviceProviderAddress,
    serviceProviderDetail,
    serviceProviderImages,
    customServices,
    serviceDay,
    timeSlote,
    service_review,
    cart,
    orderSchedule,
    orderdList,
    order,
} = require('../models');
const Sequelize = require('sequelize');
const { convenience_fees,
    discounts,
    vouchers,
    taxes } = require('../helper/constant');
const { compareSync } = require('bcrypt');



// --------------------------------- order client side -----------------------------------

// show services ......................
exports.showServices = [
    async function (req, res) {
        try {
            // console.log("dddddddd", requestQuery);
            let requestQuery = req.query, order = [], where = {};
            if (requestQuery.filter == 'max' || requestQuery.filter == 'min') {
                if (requestQuery.filter == 'max')
                    order.push(['price', 'desc'])
                else
                    order.push(['price', 'asc'])
            }
            if (requestQuery.search)
                where.titel = { [Op.like]: '%' + requestQuery.search + '%' }

            const findClient = await clientDetail.findOne({ Where: { id: req.user.id } });
            if (findClient == null)
                return response.failedResponse(res, "user not logged in ...")
            // return response.successResponse(res, findClient);

            const findServices = await customServices.findAll(
                {
                    where: where,
                    order: order
                }
            );
            if (!findServices)
                return response.failedResponse(res, "service couldn't find ...")
            return response.successResponse(res, findServices)

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// open product ...............
exports.openService = [
    async function (req, res) {
        try {
            let requestQuery = req.query, whereDay = {};
            if (requestQuery.day)
                whereDay.day = { [Op.like]: requestQuery.day + '%' }

            const findClient = await clientDetail.findOne({ Where: { id: req.user.id } });
            if (findClient == null)
                return response.failedResponse(res, "user not logged in ...")
            const findServices = await customServices.findOne({
                where: {
                    id: requestQuery.custom_services_id,
                },
                include: [
                    {
                        model: serviceProvider, attributes: ['first_name', 'last_name'],

                        include: [
                            {
                                model: serviceProviderImages, attributes: ['id', 'images']
                            }, {
                                model: serviceDay, attributes: ['id', 'day'], where: whereDay,
                                include: [
                                    {
                                        model: timeSlote, attributes: ['id', 'slot_to', 'slot_from'],
                                    }]
                            }],
                    }, {
                        model: service_review
                    }]
            });
            const findServiceReview = await service_review.findAll({
                where: { service_id: req.query.custom_services_id },
                attributes:[
                    [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('rating'), 'float')), 'rating']
                ]
            })
            if (!findServices)
                return response.failedResponse(res, "service couldn't find ...")
            return response.successResponse(res, { msg: "service opened ...", data: findServices, reviews:findServiceReview })

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// add product in cart ----------------------
exports.addServiceInCart = [
    body("service_id").notEmpty().withMessage("service_id is requried"),
    body("time_slot_id").notEmpty().withMessage("time_slot_id is requried"),
    body("schedule_date").notEmpty().withMessage("time_slot_id is requried"),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            let currentDate = moment().format("YYYY-MM-DD")
            if (req.body.schedule_date > currentDate) {
                return response.failedResponse(res, "date could'n be enter pre or today ...")
            }
            let requestBody = req.body;
            const findCart = await cart.findOne({ where: { client_id: req.user.id, service_id: requestBody.service_id, cart_status: '1' } });
            if (findCart)
                return response.failedResponse(res, "service already add in cart ...");

            const findServices = await customServices.findOne({
                where: {
                    id: requestBody.service_id
                }, include: [
                    {
                        model: serviceProvider, attributes: ['first_name', 'last_name'],
                        include: [
                            {
                                model: serviceDay, attributes: ['id', 'day'],
                                include: [
                                    {
                                        model: timeSlote, attributes: ['id', 'slot_to', 'slot_from'], where: { id: requestBody.time_slot_id },
                                    }]
                            }]
                    }
                ]
            });
            // console.log('==================○○○○○○○○○○○○○   ',findServices.serviceProvider.serviceDays[0].timeSlotes)
            if (findServices == null)
                return response.failedResponse(res, "service not exist ...");
            let cartPayload = {
                client_id: req.user.id,
                service_id: findServices.id,
                schedule_date: requestBody.schedule_date,
                time_slot_id: requestBody.time_slot_id,
                price: findServices.price
            }
            // console.log("====>>>",cartPayload)

            const addCart = await cart.create(cartPayload);
            if (!addCart)
                return response.failedResponse(res, "cart couldn't add ...");
            return response.successResponse(res, addCart);

        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// show cart and bill details -------------------------
exports.showCart = [
    async function (req, res) {
        try {
            let service_charges = 0, total_amount = 0, count = 0;
            const cartShow = await cart.findAll({
                where: { client_id: req.user.id, cart_status: 1 },
                include: [
                    {
                        model: customServices, attributes: ['titel'],
                        include: [
                            { model: serviceProvider, attributes: ['first_name', 'last_name'], }
                        ]
                    }
                ]
            });
            // console.log("length ===========>>>>>>", cartShow.length)
            if (cartShow.length == 0)
                return response.failedResponse(res, "cart list is empty ...");

            for (let key of cartShow) {
                service_charges += key.price;
                count++
            };
            let convenience_fee = parseFloat(service_charges / 100 * convenience_fees);
            let discount = parseFloat(service_charges / 100 * discounts);
            let voucher = parseFloat(service_charges / 100 * vouchers);
            let tax = parseFloat(service_charges / 100 * taxes);
            total_amount = parseFloat(service_charges + convenience_fee - discount - voucher + tax).toFixed(2);

            let billDetail = {
                count,
                service_charges: service_charges.toFixed(2),
                convenience_fee: convenience_fee.toFixed(2),
                discount: discount.toFixed(2),
                voucher: voucher.toFixed(2),
                tax: tax.toFixed(2),
                total_amount
            };

            return response.successResponse(res, { data: cartShow, billDetail });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// remove cart item -----------------------
exports.removeCartItem = [
    async function (req, res) {
        try {
            const requestQuery = req.query;
            const findCart = await cart.findOne({
                where: { id: requestQuery.id, client_id: req.user.id, cart_status: 1 },
            });
            if (findCart == null)
                return response.failedResponse(res, "cart item not exist ...");
            await cart.destroy({ where: { id: requestQuery.id, client_id: req.user.id, cart_status: 1 } });
            return response.successResponse(res, { mag: "cart item deleted ...", data: findCart });
        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// place order ----------------------
exports.placeOrder = [
    body('address_id').notEmpty().withMessage('address_id is requeried'),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            let currentDate = moment().format("YYYY-MM-DD");
            let service_charges = 0, total_amount = 0, count = 0, storeOrder_id = 0;
            const findCart = await cart.findAll({ where: { client_id: req.user.id, cart_status: '1' } });
            // console.log("cart =========>>>>>>>>>>>",findCart);
            if (findCart.length == 0)
                return response.failedResponse(res, "no one item is pending ...")

            const findAdress = await clientAddress.findOne({ where: { id: req.body.address_id, client_id: req.user.id } });
            // console.log("--------------------- ",findAdress)
            if (findAdress == null)
                return response.failedResponse(res, "client address not found");

            let emptyDetail = {
                total_services: 0,
                countotal_services: 0,
                service_charges: 0,
                convenience_fee: 0,
                discount: 0,
                voucher: 0,
                tax: 0,
                total_amount: 0
            };
            const createEmptyorder = await order.create(emptyDetail);
            if (!createEmptyorder)
                return response.failedResponse(res, "order couldn't created");
            storeOrder_id = createEmptyorder.id;


            for (let key of findCart) {
                // console.log("cart =========>>>>>>>>>>>",key);

                let orderSchedulePayload = {
                    client_id: req.user.id,
                    schedule_date: key.schedule_date,
                    time_slot_id: key.time_slot_id,
                }
                if (key.schedule_date > currentDate) {
                    return response.failedResponse(res, "date could'n be enter previous or today ...")
                }

                // let findOrderSchedule = await orderSchedule.findOne({
                //     where: {
                //         schedule_date: req.body.schedule_date,
                //         time_slot_id: key.time_slot_id,
                //         is_booked: true
                //     }
                // });
                let findService = await customServices.findOne({
                    where: { id: key.service_id }
                });

                let findOrderSchedule = await serviceDay.findOne({
                    where: { serviceProvider_id: findService.serviceProvider_id },
                    include: [
                        {
                            model: timeSlote, where: { id: key.time_slot_id },
                            include: [
                                { model: orderSchedule, where: { is_booked: true, schedule_date: key.schedule_date } }
                            ]
                        }
                    ]
                })
                // console.log("==========================", findOrderSchedule)
                if (findOrderSchedule != null) {
                    await order.destroy({ where: { id: storeOrder_id } })
                    return response.failedResponse(res, `${req.body.schedule_date} & time slot ${key.time_slot_id} is booked already ...`)
                }
                // console.log("============>>>>>",orderSchedulePayload)
                let createOrderSchedule = await orderSchedule.create(orderSchedulePayload);

                let orderListPayload = {
                    client_id: req.user.id,
                    service_id: key.service_id,
                    order_id: storeOrder_id,
                    order_schedule_id: createOrderSchedule.id,
                    price: key.price,
                    client_address_id: findAdress.id,
                }
                console.log("======>>>", orderListPayload);
                await orderdList.create(orderListPayload);
            };

            const deleteCartItems = await cart.destroy({ where: { client_id: req.user.id, cart_status: '1' } });
            if (!deleteCartItems)
                return response.failedResponse(res, "couldn't delete cart items ...")

            const findOrderList = await orderdList.findAll({ where: { client_id: req.user.id, order_id: storeOrder_id } });
            if (findOrderList.length == 0)
                return response.failedResponse(res, "couldn't find order list ...");
            for (let key of findOrderList) {
                service_charges += key.price;
                count++
            };
            // console.log("count==================>>>>>>>>>>",count)
            let convenience_fee = parseFloat(service_charges / 100 * convenience_fees);
            let discount = parseFloat(service_charges / 100 * discounts);
            let voucher = parseFloat(service_charges / 100 * vouchers);
            let tax = parseFloat(service_charges / 100 * taxes);
            total_amount = parseFloat(service_charges + convenience_fee - discount - voucher + tax);

            let orderPayload = {
                client_id: req.user.id,
                total_services: count,
                service_charges: service_charges.toFixed(2),
                convenience_fee: convenience_fee.toFixed(2),
                discount: discount.toFixed(2),
                voucher: voucher.toFixed(2),
                tax: tax.toFixed(2),
                total_amount: total_amount.toFixed(2),
            };

            const updateOrder = await order.update(orderPayload, { where: { id: storeOrder_id } })
            if (!updateOrder)
                return response.failedResponse(res, "couldn't update order ...");

            const findfinalOrder = await order.findOne({ where: { id: storeOrder_id } });

            return response.successResponse(res, { msg: "order is created ...", data: findfinalOrder })


        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// show order ----------------------
exports.showOrders = [
    async function (req, res) {
        try {
            // let service_charges = 0, total_amount = 0, count = 0;
            const orderListShow = await orderdList.findAll({
                where: { client_id: req.user.id, order_id: req.query.order_id },
            });
            // console.log("length ===========>>>>>>", orderListShow.length)
            if (orderListShow.length == 0)
                return response.failedResponse(res, "order list is empty ...");

            const orderShow = await order.findOne({
                where: { client_id: req.user.id, id: req.query.order_id },
            });

            return response.successResponse(res, { orderListShow, orderShow });


        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]


// --------------------------------- order service provider side -----------------------------------

// show order to service provider ---------------------
exports.showBookingServiceProvider = [
    async function (req, res) {
        try {

            const checkServiceProvider = await serviceProvider.findOne({ where: { id: req.user.id } });
            if (checkServiceProvider == null)
                return response.failedResponse(res, "serviceProvider couldn't found ...");

            const showServiceProviderAdd = await serviceProviderAddress.findOne({ where: { serviceProvider_id: req.user.id, } })
            if (showServiceProviderAdd == null)
                return response.failedResponse(res, "address not exist ...");

            const latitude = showServiceProviderAdd.latitude;
            const longitude = showServiceProviderAdd.longitude;
            const distance = 5000;

            const haversine = `(
                    6371000 * acos(
                        cos(radians(${latitude}))
                        * cos(radians(latitude))
                        * cos(radians(longitude) - radians(${longitude}))
                        + sin(radians(${latitude})) * sin(radians(latitude))
                    )
                )`;

            // const get12 = await clientAddress.findAll({
            //     where: {
            //         client_id: 2,},
            //         attributes: [
            //             'id',
            //             [Sequelize.literal(haversine), 'distance'],
            //         ],
            //         having: Sequelize.literal(`distance <= ${distance}`)
            // });

            // return response.successResponse(res, get12);
            // return response.successResponse(res, { latitude, longitude, haversine });


            const showOrders = await serviceProvider.findOne({
                where: { id: req.user.id },
                attributes: ['first_name', 'last_name'],
                include: [
                    {
                        model: customServices, attributes: ['titel'],
                        include: [
                            {
                                model: orderdList, where: { order_status: '1', complete_status: false },
                                include: [
                                    {
                                        model: clientAddress, attributes: ['location', [Sequelize.literal(haversine), 'distance']],
                                        having: Sequelize.literal(`distance <= ${distance}`)
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            return response.successResponse(res, showOrders)

        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]
// take action service Provider -----------------------
exports.takeActionOnOrder = [
    async function (req, res) {
        try {
            let requestBody = req.body;

            const checkServiceProvider = await serviceProvider.findOne({ where: { id: req.user.id } });
            if (checkServiceProvider == null)
                return response.failedResponse(res, "serviceProvider couldn't found ...");

            const showServiceProviderAdd = await serviceProviderAddress.findOne({ where: { serviceProvider_id: req.user.id, } })
            if (showServiceProviderAdd == null)
                return response.failedResponse(res, "address not exist ...");

            const latitude = showServiceProviderAdd.latitude;
            const longitude = showServiceProviderAdd.longitude;
            const distance = 5000;

            const haversine = `(
                    6371000 * acos(
                        cos(radians(${latitude}))
                        * cos(radians(latitude))
                        * cos(radians(longitude) - radians(${longitude}))
                        + sin(radians(${latitude})) * sin(radians(latitude))
                    )
                )`;

            const findOrderIsPending = await orderdList.findOne({
                where: { id: requestBody.order_id, order_status: '1', complete_status: false }
            });
            if (findOrderIsPending == null)
                return response.failedResponse(res, "order couldn't show ...")

            if (requestBody.action == '2' || requestBody.action == '3') {
                await orderdList.update({ order_status: requestBody.action }, { where: { id: requestBody.order_id } })
                if (requestBody.action == '2')
                    await orderSchedule.update({ is_booked: true }, { where: { id: findOrderIsPending.order_schedule_id } })
            } else {
                return response.failedResponse(res, { msg: "not valid action ...", data: requestBody.action });
            }

            const updatedOrder = await orderdList.findOne({
                where: { id: requestBody.order_id, complete_status: false },
                include: [
                    {
                        model: clientAddress, attributes: ['location', [Sequelize.literal(haversine), 'distance']],
                        having: Sequelize.literal(`distance <= ${distance}`)
                    }
                ]
            })

            return response.successResponse(res, { msg: "order is updated now ...", data: updatedOrder });
        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// show home screen ---------------------
exports.homeScreen = [
    async function (req, res) {
        try {
            let currentDate = moment().format("YYYY-MM-DD");

            const checkServiceProvider = await serviceProvider.findOne({ where: { id: req.user.id } });
            if (checkServiceProvider == null)
                return response.failedResponse(res, "serviceProvider couldn't found ...");

            const active = await orderdList.findAll({
                where: { order_status: '2' },
                attributes: [
                    [sequelize.fn('count', sequelize.col('orderdList.id')), 'total_active'],
                ], raw: true,
                include: [
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] },
                    { model: orderSchedule, required: true, where: { is_booked: true, schedule_date: { [Op.gt]: currentDate } }, attributes: [] },
                ],
            });
            const complete = await orderdList.findAll({
                where: { complete_status: true },
                attributes: [
                    [sequelize.fn('count', sequelize.col('orderdList.id')), 'total_complete'],
                ], raw: true,
                include: [
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ],
            });
            const scheduled = await orderdList.findAll({
                where: {},
                attributes: [
                    [sequelize.fn('count', sequelize.col('orderdList.price')), 'total_schedule'],
                ], raw: true,
                include: [
                    { model: orderSchedule, required: true, where: { is_booked: true, schedule_date: currentDate }, attributes: [] },
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ]
            });
            const earning = await orderdList.findAll({
                where: { complete_status: true },
                attributes: [
                    [sequelize.fn('sum', sequelize.col('orderdList.price')), 'total_amount'],
                ], raw: true,
                include: [
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ]
            });
            const cancel = await orderdList.findAll({
                where: { order_status: '4' },
                attributes: [
                    [sequelize.fn('count', sequelize.col('orderdList.price')), 'total_cancel'],
                ], raw: true,
                include: [
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ]
            });
            const reviews = await service_review.findAll({
                attributes: [
                    [sequelize.fn('count', sequelize.col('service_review.id')), 'total_review'],
                ], raw: true,
                include: [
                    { model: customServices, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ]
            })






            // const earning = await orderdList.findAll({
            //      attributes: [
            //         [sequelize.fn('sum', sequelize.col('price')), 'total_amount'],
            //     ],
            //     include: [
            //         { model: customServices, required: true, where: { serviceProvider_id: req.user.id },attributes:[] }
            //     ]
            // });


            // let currentDate = moment().subtract(7, 'days').format("YYYY-MM-DD")
            // if (currentDate == findschedule.schedule_date) {
            // {complete_status:true}
            // }
            return response.successResponse(res, { active, scheduled, complete, earning, reviews, cancel });
            // console.log(findComplete.length);

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]
// send otp to client for start Service ------------------
exports.sendOTPtoclientForStartService = [
    async function (req, res) {
        try {
            let currentDate = moment().format("YYYY-MM-DD");

            const checkServiceProvider = await serviceProvider.findOne({ where: { id: req.user.id } });
            if (checkServiceProvider == null)
                return response.failedResponse(res, "serviceProvider couldn't found ...");

            const scheduled = await orderdList.findOne({
                where: { order_status: '2', otp_verify: false },
                // attributes: [
                // [sequelize.fn('count', sequelize.col('orderdList.price')), 'total_schedule'],], raw: true,
                include: [
                    { model: orderSchedule, required: true, where: { is_booked: true, schedule_date: currentDate }, attributes: [] },
                    { model: customServices, required: true, where: { serviceProvider_id: req.user.id }, attributes: [] }
                ]
            });

            if (scheduled == null)
                return response.failedResponse(res, "today no schedule ...");

            await orderdList.update({ otp: Math.floor(Math.random() * 9000 + 1000) }, { where: { id: scheduled.id } });
            const updatedOrder = await orderdList.findOne({ where: { id: scheduled.id } })

            return response.successResponse(res, { msg: "otp is send ...", data: updatedOrder });

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]

// virify and start service by clientc ---------------------
exports.verifyAndStartService = [
    body('orderId').notEmpty().withMessage("orderId is required ..."),
    body('otp').notEmpty().withMessage("otp is required ..."),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            const findClient = await clientDetail.findOne({ id: req.user.id });
            if (findClient == null)
                return response.failedResponse(res, "client couldn't found");

            const scheduled = await orderdList.findOne({ where: { id: req.body.orderId } });

            if (scheduled == null)
                return response.failedResponse(res, "schedule not found ...");

            if (scheduled.otp != req.body.otp)
                return response.failedResponse(res, "otp not matched ...");

            await orderdList.update({ order_status: '5', otp_verify: true }, { where: { id: scheduled.id } });

            return response.successResponse(res, "otp is matched and service is start now ...")

        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]

// complete service by service provider -------------------
exports.completeService = [
    body('orderId').notEmpty().withMessage("orderId is required ..."),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            const checkServiceProvider = await serviceProvider.findOne({ where: { id: req.user.id } });
            if (checkServiceProvider == null)
                return response.failedResponse(res, "serviceProvider couldn't found ...");

            const scheduled = await orderdList.findOne({ where: { id: req.body.orderId } });

            if (scheduled == null)
                return response.failedResponse(res, "schedule not found ...");

            await orderdList.update({ complete_status: true }, { where: { id: scheduled.id } });
            await orderSchedule.update({ is_booked: false }, { where: { id: scheduled.order_schedule_id } });

            return response.successResponse(res, "service completed ...");

        } catch (error) {
            return response.failedResponse(res, error.message);
        }
    }
]

// give review on service ------------------  
exports.giveReviewOnService = [
    body('order_id').notEmpty().withMessage("orderId is required ..."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return response.failedResponse(res, errors.array());

            const findClient = await clientDetail.findOne({ id: req.user.id });
            if (findClient == null)
                return response.failedResponse(res, "client couldn't found ...");

            const order = await orderdList.findOne({ where: { id: req.body.order_id, client_id: req.user.id, complete_status: true } });
            if (order == null)
                return response.failedResponse(res, "order couldn't found ...");

            const findReview = await service_review.findOne({ where: { order_id: order.id, client_id: req.user.id, service_id: order.service_id } });

            if (findReview)
                return response.failedResponse(res, "already submited review ...");

            let serviceReviewPayload = {
                order_id: order.id,
                service_id: order.service_id,
                client_id: req.user.id,
                rating: req.body.rating,
                review: req.body.review
            }
            await service_review.create(serviceReviewPayload);

            return response.successResponse(res, "review submit ...")
        } catch (error) {
            return response.failedResponse(res, error.message)
        }
    }
]

// let currentDate = moment().format("YYYY-MM-DD")
// console.log("2023-02-10">currentDate);

function ab(o){
return o.a+o.b;
}

obj={
    a:10,
    b:50
}
// console.log(ab(obj))

