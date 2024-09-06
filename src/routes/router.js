const { menuRoutes } = require("../modules/menu/menu.routes");
const { categoryRoutes } = require("../modules/category/category.routes");
const { suggestionRoutes } = require("../modules/suggestions/suggestions.routes");
const { userRoutes } = require("../modules/user/user.routes");
const { toolsRoutes } = require("../modules/tools/tools.routes");
const { reservationRoutes } = require("../modules/reservation/reservation.routes");
const { waiterRoutes } = require("../modules/waiter/waiter.routes");
const { orderRoutes } = require("../modules/order/order.routes");
const { frontOfficeRoutes } = require("../modules/frontOffice/frontOffice.routes");
const { default: axios } = require("axios");
const HolidayAPI = require('holidayapi');
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
router.use("/waiter", waiterRoutes)
router.use("/order", orderRoutes)
router.use("/frontoffice", frontOfficeRoutes)


router.get("/holiday", async (req, res) => {
    const holidayApi = new HolidayAPI({ key: 'd256db75-f231-4db3-9549-86e5f9eff08c' });
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth() returns 0-based index

        // Fetch holidays for the current month
        const holidays = await holidayApi.v1.holidays({
            country: 'US', // Change to your required country code
            year: year,
            month: month
        });

        res.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ error: 'Failed to fetch holidays' });
    }
})


module.exports = {
    allRoutes: router,
};
