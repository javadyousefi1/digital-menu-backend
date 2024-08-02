const router = require("express").Router();
// controllers
const { OrderController } = require("./order.controller");
// guard
const { checkIsAdmin } = require("../../common/guards/auth.guard")

router.post("/create-order", OrderController.addNewOrder)
router.get("/get-all-orders", OrderController.getAllorders)
router.delete("/delete-order", OrderController.deleteorder)

module.exports = {
    orderRoutes: router
}