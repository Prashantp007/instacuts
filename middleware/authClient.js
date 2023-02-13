const jwt = require('jsonwebtoken');
const {clientDetail} = require('../models');

exports.verify = async function (req, res, next){
    try {
        if(!req.headers.authorization)
            return res.status(400).json({error: "unauthorized ..."});
        let token = req.headers.authorization.split(" ")[1];
        let verifyToken = jwt.verify(token, process.env.JWT);
        console.log("token=>>>>>>>> ",verifyToken);
        let verified = await clientDetail.findOne({where:{id:verifyToken.id}});
        if(verified){
            req.user = verified;
            next();
        }
    } catch (error) {
        return res.status(400).json({
            msg:"error",
            error: error.message
        })
    }
}