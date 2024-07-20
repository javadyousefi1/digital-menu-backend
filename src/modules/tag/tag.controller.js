const { isValidObjectId } = require('mongoose');
const Controller = require('../../common/controllers/controller')
// model
const { tagModel } = require('./tag.model')
// error handling
const createError = require("http-errors");

class TagController extends Controller {
    #model
    constructor() {
        super()
        this.#model = tagModel
    }

    async addNewTag(req, res, next) {
        try {
            // get data from body
            const { title, svgIcon } = req.body;
            const newTag = { title, svgIcon };
            // check dublicate
            const isAlreadyExist = await this.#model.countDocuments({ title: title.trim(), svgIcon })
            if (isAlreadyExist) throw new createError.BadRequest("this tag already exists !")
            // insert new tag to DB
            const newTagCreated = await this.#model.create(newTag);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Tag added successfully",
                data: newTagCreated
            })
        } catch (error) {
            next(error)
        }
    }

    async updateTag(req, res, next) {
        try {
            // get data from body
            const { title, id } = req.body;
            const updatedTag = { title, _id: id };
            // update tag from DB
            const newTagCreated = await this.#model.updateOne(updatedTag);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Tag updated successfully",
                data: newTagCreated
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllTags(req, res, next) {
        try {
            const Tags = await this.#model.find({});
            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Tag resived successfully",
                data: Tags
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteTag(req, res, next) {
        const { id } = req.query;
        if (!id) throw new createError.BadRequest("you dont sent id !")
        try {
            const Tags = await this.#model.deleteOne({ _id: id });
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Tag deleted successfully",
                data: Tags._id
            })
        } catch (error) {
            next(error)
        }
    }

    async isTagidAlreadyExistsById(id, next = () => { }) {
        try {
            if (!isValidObjectId(id)) throw new createError.BadRequest("your tag id is not valid")
            const foundBlog = await this.#model.countDocuments({ _id: id })
            if (!foundBlog) throw new createError.NotFound("not found a tag with this id !")
        } catch (error) {
            next(error)
        }
    }

    async isTagListValid(list, next = () => { }) {
        try {
            console.log(list)
            if (Array.isArray(list)) {
                list.forEach(async (lId) => {
                    try {
                        if (!isValidObjectId(lId)) throw new createError.BadRequest("your tag id is not valid")
                        const result = await this.#model.countDocuments({ _id: lId })
                        if (result === 0) throw new createError.BadRequest("not found tag id")
                    } catch (e) {
                        next(e)
                    }
                })
            } else {
                throw new createError.BadRequest("pass an array for tag")
            }


        } catch (error) {
            next(error)
        }
    }
}


module.exports = { TagController: new TagController() }