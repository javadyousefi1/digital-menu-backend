const { blogRoutes } = require("../modules/blog/blog.routes");
const { categoryRoutes } = require("../modules/category/category.routes");
const { tagRoutes } = require("../modules/tag/tag.routes");
const { userRoutes } = require("../modules/user/user.routes");

const router = require("express").Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to Javad app :)" })
});

router.use("/user", userRoutes)
router.use("/blog", blogRoutes)
router.use("/category", categoryRoutes)
router.use("/tag", tagRoutes)

module.exports = {
    allRoutes: router,
};
