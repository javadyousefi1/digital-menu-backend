const Controller = require('../../common/controllers/controller.js')
// model
const { categoryModel } = require('../category/category.model.js')
// error handling
const createError = require("http-errors");
// path
const path = require('path');
const fs = require('fs');
const { paginate, buildSearchQuery } = require('../../utils/helpers.js');
const { menuModel } = require('../menu/menu.model.js');
const { default: mongoose, isValidObjectId } = require('mongoose');
class FrontOfficeController extends Controller {
    #categoryModel
    #menuModel
    constructor() {
        super()
        this.#categoryModel = categoryModel
        this.#menuModel = menuModel
    }

    async getAllCategorys(req, res, next) {
        try {

            const categories = await this.#categoryModel.find({}, "title isActive order image.path").sort({ createdAt: -1 })

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

            const menus = await this.#menuModel.find({ "categoryId": categoryObjectId }, "title price offPrice isActive image.path").sort({ createdAt: -1 });

            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Menus resived successfully", data: menus
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = { FrontOfficeController: new FrontOfficeController() }