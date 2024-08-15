// multer
const multer = require('multer');
// router
const router = require("express").Router();
// guard
const { FrontOfficeController } = require('./frontOffice.controller');


router.get("/get-all-categories", FrontOfficeController.getAllCategorys)
router.get("/get-all-menus-by-category", FrontOfficeController.getAllmenuByCategory)

module.exports = {
    frontOfficeRoutes: router
}