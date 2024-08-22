// multer
const multer = require('multer');
// guards
const { isAuthorized, checkIsAdmin } = require("../../common/guards/auth.guard");
// controller
const { MenuController } = require("./menu.controller");
// router
const router = require("express").Router();

// Configure multer storage

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const now = new Date().getTime();
        const name = `${now}.${file.originalname.split(".").at(-1)}`
        req.fileName = name
        req.imageId = now
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

router.post("/create-menu", upload.single('file'), MenuController.addNewMenu)
router.put("/update-menu", upload.single('file'), MenuController.updateMenu)
router.get("/get-all-menus", checkIsAdmin, MenuController.getAllMenus)
router.get("/get-menu-byId", MenuController.getMenuById)
router.delete("/delete-menu", MenuController.deleteMenu)
router.patch("/toggle-menu-status", MenuController.toggleMenuStatus)
// router.post("/add-comment", isAuthorized, MenuController.addComment)
// router.post("/reply-comment", isAuthorized, MenuController.replyComment)
// router.delete("/delete-comment", isAuthorized, MenuController.deleteComment)
// router.post("/like-blog", isAuthorized, MenuController.likeBLog)
// router.post("/verify-comment", checkIsAdmin, MenuController.verifyComment)

module.exports = {
    menuRoutes: router
}