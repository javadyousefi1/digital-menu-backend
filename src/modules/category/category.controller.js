const { isValidObjectId } = require('mongoose');
const Controller = require('../../common/controllers/controller')
// model
const { categoryModel } = require('./category.model')
// error handling
const createError = require("http-errors");
// path
const path = require('path');
const fs = require('fs');
class CategoryController extends Controller {
    #model
    constructor() {
        super()
        this.#model = categoryModel
    }

    async addNewCategory(req, res, next) {
        try {
            // get data from body
            const { title, } = req.body;
            // check file is exsited or not
            if (!req?.file) throw new createError.BadRequest("File not found")
            // fileUrl
            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req?.file?.filename}`;
            const newCategory = { title, image: fileUrl };

            // check dublicate
            const isAlreadyExist = await this.#model.countDocuments({ title: title.trim() })
            if (isAlreadyExist) return res.status(400).json({ statusCode: res.statusCode, message: "this category already exists !" })
            // insert new category to DB
            const newCategoryCreated = await this.#model.create(newCategory);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Category added successfully",
                data: newCategoryCreated
            })
        } catch (error) {
            let imagePath = path.join(__dirname, `../../../uploads/${req.fileName}`)
            if (fs.existsSync(imagePath)) {
                await fs.unlinkSync(imagePath);
            }
            next(error)
        }
    }

    async updateCategory(req, res, next) {
        try {
            // get data from body
            const { title, id } = req.body;
            const updatedCategory = { title, _id: id };
            // update category from DB
            const newCategoryCreated = await this.#model.updateOne(updatedCategory);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Category updated successfully",
                data: newCategoryCreated
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllCategorys(req, res, next) {
        try {
            const Categorys = await this.#model.find({});
            res.status(200).json({
                statusCode: res.statusCode,
                message: "all Category resived successfully",
                data: Categorys
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteCategory(req, res, next) {
        const { id } = req.query;
        if (!id) throw new createError.BadRequest("you dont sent id !")
        try {
            const Categorys = await this.#model.deleteOne({ _id: id });
            res.status(200).json({
                statusCode: res.statusCode,
                message: "Category deleted successfully",
                data: Categorys._id
            })
        } catch (error) {
            next(error)
        }
    }

    async isCategoryidAlreadyExistsById(id, next = () => { }) {
        try {
            if (!isValidObjectId(id)) throw new createError.BadRequest("your category id is not valid")
            const foundBlog = await this.#model.countDocuments({ _id: id })
            if (!foundBlog) throw new createError.NotFound("not found a category with this id !")
        } catch (error) {
            next(error)
        }
    }
}


module.exports = { CategoryController: new CategoryController() }