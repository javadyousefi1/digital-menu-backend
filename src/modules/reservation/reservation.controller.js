const { isValidObjectId, default: mongoose } = require('mongoose');
const Controller = require('../../common/controllers/controller.js')
// model
const { reservationModel } = require('../reservation/reservation.model.js')
// error handling
const createError = require("http-errors");
// path
const path = require('path');
const fs = require('fs');
const { paginate, buildSearchQuery } = require('../../utils/helpers.js');

class ReservationController extends Controller {
    #model
    constructor() {
        super()
        this.#model = reservationModel
    }

    async addNewReservation(req, res, next) {
        try {
            // get data from body
            const { name, date, text, deskNumber, phone } = req.body;
            const newReservation = { name, date, text, deskNumber, phone }
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
        const { name, date, text, deskNumber, id, phone } = req.body;
        const updatedReservation = { name, date, text, deskNumber, phone };
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
            const { pageSize, pageIndex, search, date } = req.query;
    
            // Validate date format
            if (date && !/^(\d{4}-\d{2})$/.test(date)) {
                throw new Error('Invalid date format. Expected YYYY-MM.');
            }
    
            // Default values for year and month if not provided
            let year = new Date().getFullYear();
            let month = new Date().getMonth() + 1; // Months are zero-based in JavaScript
    
            // Extract year and month from the input date if provided
            if (date) {
                const [yearStr, monthStr] = date.split('-');
                year = parseInt(yearStr);
                month = parseInt(monthStr);
            }
    
            // Convert to UTC for consistency
            const startDateUTC = new Date(Date.UTC(year, month - 1, 1));
            const endDateUTC = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
            // Use the helper to build the search query
            const searchQuery = buildSearchQuery(search, "name");
    
            // Initialize an empty object for the final query parameters
            let finalQueryParams = {
                ...searchQuery
            };
    
            // Conditionally add the date filter
            if (date) {
                finalQueryParams.date = {
                    $gte: startDateUTC,
                    $lt: endDateUTC
                };
            }
    
            // Update the query with the date filter if applicable
            const paginateData = await paginate(this.#model, finalQueryParams, pageSize, pageIndex);
    
            res.status(200).json({
                statusCode: res.statusCode,
                message: "All Reservations received successfully",
                ...paginateData
            });
        } catch (error) {
            next(error);
        }
    }
    


    async getReservationById(req, res, next) {

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