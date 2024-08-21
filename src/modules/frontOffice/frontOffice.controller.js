const Controller = require('../../common/controllers/controller.js')
// model
const { categoryModel } = require('../category/category.model.js')
const { waiterModel } = require('../waiter/waiter.model.js')
// error handling
const createError = require("http-errors");
// path
const path = require('path');
const fs = require('fs');
const { paginate, buildSearchQuery } = require('../../utils/helpers.js');
const { menuModel } = require('../menu/menu.model.js');
const { default: mongoose, isValidObjectId } = require('mongoose');
const { getSocket } = require('../../socket/socketHandler.js');
class FrontOfficeController extends Controller {
    #categoryModel
    #menuModel
    #waiterModel
    constructor() {
        super()
        this.#categoryModel = categoryModel
        this.#menuModel = menuModel
        this.#waiterModel = waiterModel
    }

    async getAllCategorys(req, res, next) {
        try {

            const categories = await this.#categoryModel.find({}, "title isActive order image.path").sort({ order:1 })

            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Category resived successfully", data: categories
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllmenuByCategory(req, res, next) {
        try {

            const { categoryId } = req.query
            if (!categoryId) throw createError.BadRequest("send categoryId !!")
            if (!isValidObjectId(categoryId)) throw new createError.BadRequest("your category id is not valid")


            // Convert categoryId to ObjectId if it's a string
            const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

            const menus = await this.#menuModel.find({ "categoryId": categoryObjectId }, "title text price offPrice isActive image.path").sort({ createdAt: -1 });

            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Menus resived successfully", data: menus
            })
        } catch (error) {
            next(error)
        }
    }

    async addNewWaiter(req, res, next) {
        try {
            if (!req.captchaIsValid) throw new createError.BadRequest("captcha failed")
            // get data from body
            const { deskNumber } = req.body;
            const newwaiter = { deskNumber };
            // insert new waiter to DB
            const newWaiterCreated = await this.#waiterModel.create(newwaiter);
            // Get Socket.io instance and emit an event
            const io = await getSocket();
            await io.emit('waiterAdded', newWaiterCreated);

            res.status(200).json({
                statusCode: res.statusCode,
                message: "waiter added successfully",
                data: newWaiterCreated
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = { FrontOfficeController: new FrontOfficeController() }