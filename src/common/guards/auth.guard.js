// http errors
const createError = require("http-errors");
// jwt
const jwt = require("jsonwebtoken");
// user model
const { userModel } = require("../../modules/user/user.model")

async function isAuthorized(req, res, next) {
    try {
        // get user token
        const token = req?.cookies?.blog_jwt
        // reject if token is not available
        if (!token) throw new createError.Unauthorized("login to your account first")
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET)
        // check email is in user model or not
        if ("email" in tokenData) {
            const userData = await userModel.findOne({ email: tokenData.email })
            req.user = userData
            return next()
        }
        throw new createError.Unauthorized("user not authorized !")
    } catch (error) {
        next(error)
    }
}

async function checkIsAdmin(req, res, next) {
    try {
        // get user token
        const token = req?.cookies?.blog_jwt
        // reject if token is not available
        if (!token) throw new createError.Unauthorized("login to your account first")
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET)
        // check email is in user model or not
        if ("email" in tokenData) {
            const userData = await userModel.findOne({ email: tokenData.email })
            if (userData.role !== "admin") throw new createError.Unauthorized("you are not allowed to access this route");
            req.user = userData
            return next()
        }
        throw new createError.Unauthorized("isAdmin authporized failed !")
    } catch (error) {
        next(error)
    }
}

module.exports = { checkIsAdmin, isAuthorized }