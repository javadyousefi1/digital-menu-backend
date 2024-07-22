const { menuRoutes } = require("../modules/menu/menu.routes");
const { categoryRoutes } = require("../modules/category/category.routes");
const { suggestionRoutes } = require("../modules/suggestions/suggestions.routes");
const { userRoutes } = require("../modules/user/user.routes");
const axios = require("axios");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to Javad app :)" })
});

router.use("/user", userRoutes)
router.use("/category", categoryRoutes)
router.use("/menu", menuRoutes)
router.use("/suggestion", suggestionRoutes)

router.post("/validate-captcha", async (req, res) => {

    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
            params: {
                secret: "6LetIBYqAAAAAL8A9tM7jiiZP7Ptkn-2M8zmIghx",
                response: req.body.token,
            },
        }
    );

    res.send("response")
})

module.exports = {
    allRoutes: router,
};
