const { isValidObjectId } = require('mongoose');
const Controller = require('../../common/controllers/controller')
// model
const { orderModel } = require('./order.model')
// error handling
const createError = require("http-errors");
const { paginate } = require('../../utils/helpers');
const { getSocket } = require('../../socket/socketHandler');
const { menuModel } = require('../menu/menu.model');

class OrderController extends Controller {
    #model
    #menuModel
    constructor() {
        super()
        this.#model = orderModel
        this.#menuModel = menuModel
    }

    async addNewOrder(req, res, next) {
        try {
            // get data from body
            const { deskNumber, order, status } = req.body;
            const { totalPrice, mainOrderList } = await this.checkExistMenuId(order, next)

            const neworder = { deskNumber, status, totalPrice, order: mainOrderList };

            // insert new order to DB
            const newOrderCreated = await this.#model.create(neworder);
            // Get Socket.io instance and emit an event
            const io = await getSocket();
            await io.emit('orderAdded', newOrderCreated);

            res.status(200).json({
                statusCode: res.statusCode,
                message: "order added successfully",
                data: newOrderCreated
            })
        } catch (error) {
            next(error)
        }
    }

    async updateOrder(req, res, next) {
        try {
            // get data from body
            const { deskNumber, order, status, id } = req.body;
            const { totalPrice, mainOrderList } = await this.checkExistMenuId(order, next)

            const neworder = { deskNumber, status, totalPrice, order: mainOrderList };

            // insert new order to DB
            const newOrderUpdated = await this.#model.updateOne({ _id: id }, neworder);
            // Get Socket.io instance and emit an event
            const io = await getSocket();
            await io.emit('orderUpdated', newOrderUpdated);

            res.status(200).json({
                statusCode: res.statusCode,
                message: "order added successfully",
                data: newOrderUpdated
            })
        } catch (error) {
            next(error)
        }
    }



    async getAllorders(req, res, next) {
        try {
            const { pageSize, pageIndex } = req.query

            const paginateData = await paginate(this.#model, {}, pageSize, pageIndex)

            const orders = await this.#model.find({});
            res.status(200).json({
                statusCode: res.statusCode,
                message: "all order resived successfully",
                ...paginateData
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteorder(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) throw new createError.BadRequest("you dont sent id !")
            await this.isOrderidAlreadyExistsById(id, next)
            const orders = await this.#model.deleteOne({ _id: id });
            res.status(200).json({
                statusCode: res.statusCode,
                message: "order deleted successfully",
                data: orders._id
            })
        } catch (error) {
            next(error)
        }
    }

    async isOrderidAlreadyExistsById(id, next = () => { }) {
        try {
            if (!isValidObjectId(id)) throw new createError.BadRequest("your order id is not valid")
            const foundBlog = await this.#model.countDocuments({ _id: id })
            if (!foundBlog) throw new createError.NotFound("not found a order with this id !")
        } catch (error) {
            next(error)
        }
    }


    async checkExistMenuId(orderList, next) {
        try {
            let totalPrice = 0;

            // Map over the orderList and fetch each menu item's details
            const menuDetailsPromises = orderList.map(async (o) => {
                let result = await this.getMenu(o.menuId, next);
                if (result) {
                    if (!result.isActive) throw createError.BadRequest("one or more of menu items are not active");
                    // Convert the Mongoose document to a plain object
                    const plainResult = result.toObject();
                    delete plainResult.createdAt
                    delete plainResult.updatedAt
                    delete plainResult.isActive
                    // Add the count property to the plain object
                    plainResult.count = o.count;
                    return plainResult;
                } else {
                    throw createError.BadRequest("menu id is not valid");
                }
            });

            // Wait for all promises to resolve and sum up the results
            const mainOrderList = await Promise.all(menuDetailsPromises);
            totalPrice = mainOrderList.reduce((acc, curr) => {
                if (curr.offPrice > 0) {
                    return acc + curr.offPrice * curr.count; // Multiply by count to get the total price for each item
                } else {
                    return acc + curr.price * curr.count; // Multiply by count to get the total price for each item
                }
            }, 0);

            return { totalPrice, mainOrderList };

        } catch (error) {
            next(error);
        }
    }



    async getMenu(id, next) {
        try {
            return await this.#menuModel.findOne({ _id: id }).populate([
                { path: 'categoryId', select: 'title _id' }, // Include only the 'title' of the category
            ])
        } catch (error) {
            next(error)
        }
    }


}


module.exports = { OrderController: new OrderController() }