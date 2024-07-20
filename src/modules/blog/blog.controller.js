const { default: mongoose, isValidObjectId } = require('mongoose');
// controllers
const { CategoryController } = require("../category/category.controller.js")
const { TagController } = require("../tag/tag.controller.js")
const Controller = require('../../common/controllers/controller')
// model
const { blogModel } = require('./blog.model')
// error handling
const createError = require("http-errors");
// fs
const fs = require('fs');
// path
const path = require('path');
class BlogController extends Controller {

    #model
    #CategoryController
    #TagController
    constructor() {
        super()
        this.#model = blogModel
        this.#CategoryController = CategoryController
        this.#TagController = TagController
    }

    async addNewBlog(req, res, next) {
        try {
            const { title, text, categoryId, tags, readingDuration, } = req.body;

            const tagList = tags ? [... new Set(tags?.split(","))] : []

            if (!req.file) {
                throw new createError.BadRequest('A file is required for this operation')
            }

            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            const newBlog = { text, title, categoryId, tags, readingDuration, image: fileUrl };
            // check category id is valid or not
            await this.#CategoryController.isCategoryidAlreadyExistsById(categoryId, next)
            // check all tags valid
            await this.#TagController.isTagListValid(tagList, next)
            // prevent dublicate blogs
            const alreadyExsitWithThisTitle = await this.#model.countDocuments({ title })
            if (alreadyExsitWithThisTitle !== 0) throw new createError.BadRequest("blog already exists with this title")
            // create blog                 
            const newBlogCreated = await this.#model.create(newBlog);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "blog added successfully",
                data: newBlogCreated
            })
        } catch (error) {
            let imagePath = path.join(__dirname, `../../../uploads/${req.fileName}`)
            if (fs.existsSync(imagePath)) {
                await fs.unlinkSync(imagePath);
            }
            next(error)
        }
    }

    async getAllBlogs(req, res, next) {
        try {
            const blogs = await this.#model.find({}).populate([
                { path: 'categoryId', select: 'title _id' }, // Include only the 'title' of the category
                { path: 'tags', select: 'title _id' } // Include only the 'title' of each tag
            ]);
            res.status(200).json({
                statusCode: res.statusCode,
                message: "all blog resived successfully",
                data: blogs
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteBlog(req, res, next) {
        const { id } = req.query;
        if (!id) next(createError.BadRequest("you dont sent id !"))
        const willBeDeletedBlog = await this.isBLogidAlreadyExistsById(id, next)
        try {
            const blogs = await this.#model.deleteOne({ _id: id });
            // delete image
            const blogImageName = willBeDeletedBlog?.image.split("/").at(-1)
            let imagePath = path.join(__dirname, `../../../uploads/${blogImageName}`)
            if (fs.existsSync(imagePath)) {
                await fs.unlinkSync(imagePath);
            }

            res.status(200).json({
                statusCode: res.statusCode,
                message: "blog deleted successfully",
                data: blogs._id
            })
        } catch (error) {
            next(error)
        }
    }


    async isBLogidAlreadyExistsById(id, next = () => { }) {
        try {
            if (!isValidObjectId(id)) throw new createError.BadRequest("your id is not valid")
            const foundBlog = await this.#model.findOne({ _id: id })
            if (!foundBlog) {
                throw new createError.NotFound("not found a blog with this id !")
            } else {
                return foundBlog
            }
        } catch (error) {
            next(error)
        }
    }

    // comments
    async addComment(req, res, next) {
        try {
            const { blogId, comment } = req.body
            const commentObject = { comment: comment, _id: new mongoose.Types.ObjectId(), isChecked: false, reply: null, name: req.user.name, email: req.user.email }
            await this.isBLogidAlreadyExistsById(blogId, next)
            const updateBlogComment = await this.#model.updateOne({ _id: blogId }, { $push: { comments: commentObject } })
            res.status(200).json({
                statusCode: res.statusCode,
                message: "comment added successfully !"
            })
        } catch (error) {
            next(error)
        }
    }

    async replyComment(req, res, next) {
        try {
            const { blogId, commentId, reply } = req.body
            await this.isBLogidAlreadyExistsById(blogId, next)

            const repltObject = { userId: req.user._id, replyText: reply, isChecked: true }

            await this.#model.updateOne(
                { _id: blogId, 'comments._id': commentId },
                { $set: { 'comments.$.reply': repltObject } }
            );
            res.status(200).json({
                statusCode: res.statusCode,
                message: "replyed comment successfully !"
            })
        } catch (error) {
            next(error)
        }
    }

    async verifyComment(req, res, next) {
        try {
            const { blogId, commentId } = req.body
            await this.isBLogidAlreadyExistsById(blogId, next)
            await this.#model.updateOne(
                { _id: blogId, 'comments._id': commentId },
                { $set: { 'comments.$.isChecked': true } }
            );
            res.status(200).json({
                statusCode: res.statusCode,
                message: "comment verify successfully !"
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { blogId, commentId } = req.query
            await this.isBLogidAlreadyExistsById(blogId, next)

            const result = await this.#model.updateOne(
                { _id: blogId },
                { $pull: { comments: { _id: commentId } } }
            );

            if (result.matchedCount === 0) {
                throw new createError.NotFound('Comment not found')
            }

            res.status(200).json({
                statusCode: res.statusCode,
                message: 'Comment removed successfully'
            })


        } catch (error) {
            next(error)
        }
    }

    // like
    async likeBLog(req, res, next) {
        try {
            const userId = req.user._id;
            const { blogId } = req.body;

            await this.isBLogidAlreadyExistsById(blogId, next)

            const blog = await this.#model.findById(blogId).select('+likes');
            const hasLiked = blog.likes.includes(userId);


            if (hasLiked) {
                // Remove the user's ID from the likes array
                await this.#model.findByIdAndUpdate(blogId, { $pull: { likes: userId } });
                res.status(200).json({
                    statusCode: res.statusCode,
                    message: 'Unlike successful'
                })
            } else {
                // Add the user's ID to the likes array
                await this.#model.findByIdAndUpdate(blogId, { $push: { likes: userId } });
                res.status(200).json({
                    statusCode: res.statusCode,
                    message: "Like successful"
                })
            }

        } catch (error) {
            next(error)
        }
    }

    async test(req, res) {
        res.send("ok")
    }
}


module.exports = { BlogController: new BlogController() }