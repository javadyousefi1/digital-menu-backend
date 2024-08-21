// multer
const multer = require('multer');
// router
const router = require("express").Router();
// guard
const { FrontOfficeController } = require('./frontOffice.controller');
const { captchaHandler } = require('../../common/captcha/captchaHandler');


router.get("/get-all-categories", FrontOfficeController.getAllCategorys)
router.get("/get-all-menus-by-category", FrontOfficeController.getAllmenuByCategory)
router.post("/request-waiter", captchaHandler, FrontOfficeController.addNewWaiter)

module.exports = {
    frontOfficeRoutes: router
}