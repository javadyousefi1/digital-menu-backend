// multer
const multer = require('multer');
// guards
const { isAuthorized, checkIsAdmin } = require("../../common/guards/auth.guard");
// controller
const { BlogController } = require("./blog.controller");
// router
const router = require("express").Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const name = `${req?.body?.title}.${file.originalname.split(".").at(-1)}`
        req.fileName = name
        cb(null, name);
    }
});

const maxSize = 1048576;

const upload = multer({
    storage: storage, limits: {
        fileSize: maxSize
    }, fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type just accept image types !'), false);
        }
    }
});


router.post("/create-blog", upload.single('file'), BlogController.addNewBlog)
router.post("/add-comment", isAuthorized, BlogController.addComment)
router.post("/reply-comment", isAuthorized, BlogController.replyComment)
router.delete("/delete-comment", isAuthorized, BlogController.deleteComment)
router.post("/like-blog", isAuthorized, BlogController.likeBLog)
router.post("/verify-comment", checkIsAdmin, BlogController.verifyComment)
router.get("/get-all-blogs", BlogController.getAllBlogs)
router.delete("/delete-blog", BlogController.deleteBlog)

module.exports = {
    blogRoutes: router
}