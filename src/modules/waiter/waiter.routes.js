const router = require("express").Router();
// controllers
const { waiterController } = require("./waiter.controller");
// guard
const { checkIsAdmin } = require("../../common/guards/auth.guard")

router.post("/create-waiter", waiterController.addNewWaiter)
router.get("/get-all-waiters", waiterController.getAllwaiters)
router.delete("/delete-waiter", waiterController.deletewaiter)

module.exports = {
    waiterRoutes: router
}