const { menuRoutes } = require("../modules/menu/menu.routes");
const { categoryRoutes } = require("../modules/category/category.routes");
const { suggestionRoutes } = require("../modules/suggestions/suggestions.routes");
const { userRoutes } = require("../modules/user/user.routes");
const { toolsRoutes } = require("../modules/tools/tools.routes");
const { reservationRoutes } = require("../modules/reservation/reservation.routes");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to Javad app :)" })
});

router.use("/user", userRoutes)
router.use("/category", categoryRoutes)
router.use("/menu", menuRoutes)
router.use("/suggestion", suggestionRoutes)
router.use("/tools", toolsRoutes)
router.use("/reservation", reservationRoutes)



module.exports = {
    allRoutes: router,
};
