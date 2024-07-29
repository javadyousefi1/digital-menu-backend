const { isValidObjectId, default: mongoose } = require('mongoose');
const Controller = require('../../common/controllers/controller.js')
// model
const { reservationModel } = require('../reservation/reservation.model.js')
// error handling
const createError = require("http-errors");
// path
const path = require('path');
const fs = require('fs');
const { paginate } = require('../../utils/helpers.js');

class ReservationController extends Controller {
    #model
    constructor() {
        super()
        this.#model = reservationModel
    }

    async addNewReservation(req, res, next) {
        try {
            // get data from body
            const { name, date, text, deskNumber } = req.body;
            const newReservation = { name, date, text, deskNumber }
            // insert new category to DB
            const newReservationCreated = await this.#model.create(newReservation);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Reservation added successfully",
                data: newReservationCreated
            })
        } catch (error) {
            next(error)
        }
    }

    async updateReservation(req, res, next) {
        const { name, date, text, deskNumber, id } = req.body;
        const updatedReservation = { name, date, text, deskNumber };
        await this.isReservationidAlreadyExistsById(id, next)
        try {

            await this.#model.updateOne({ _id: id }, { $set: updatedReservation });

            res.status(200).json({
                statusCode: res.statusCode,
                message: "reservation updated successfully",
            });
        } catch (error) {
            next(error);
        }
    }


    async getAllReservations(req, res, next) {
        try {
            const { pageSize, pageIndex } = req.query

            const paginateData = await paginate(this.#model, {}, pageSize, pageIndex)

            await this.#model.find({});
            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Reservations resived successfully",
                ...paginateData
            })
        } catch (error) {
            next(error)
        }
    }


    async getCategoryById(req, res, next) {

        try {
            const { id } = req.query;
            if (!id) next(createError.BadRequest("you dont sent id !"))

            const reuslt = await this.isReservationidAlreadyExistsById(id, next)


            res.status(200).json({
                statusCode: res.statusCode,
                message: "Category gets successfully",
                data: reuslt
            })
        } catch (error) {
            next(error)
        }
    }


    async deleteReservations(req, res, next) {

        try {
            const { id } = req.query;
            if (!id) next(createError.BadRequest("you dont sent id !"))
            await this.isReservationidAlreadyExistsById(id, next)
            await this.#model.deleteOne({ _id: id });

            res.status(200).json({
                statusCode: res.statusCode,
                message: "Reservations deleted successfully",
            })
        } catch (error) {
            next(error)
        }
    }


    async isReservationidAlreadyExistsById(id, next = () => { }) {
        try {
            if (!isValidObjectId(id)) throw new createError.BadRequest("your reservation id is not valid")
            const foundReservation = await this.#model.findOne({ _id: id })
            if (!foundReservation) {
                throw new createError.NotFound("not found a reservation with this id !")
            } else {
                return foundReservation
            }
        } catch (error) {
            next(error)
        }
    }
}


module.exports = { ReservationController: new ReservationController() }