const axios = require("axios");

const captchaHandler = async (req, res, next) => {

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.GOOGLE_CAPTCHA_VALIDATE_KEY,
                    response: req.body.token,
                },
            }
        );

        if (response.success === true) {
            next()
        }
    } catch (e) {
        next(e)
    }
}


module.exports = { captchaHandler }