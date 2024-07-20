const router = require("express").Router();
// controllers
const { TagController } = require("./tag.controller");
// guard
const { checkIsAdmin } = require("../../common/guards/auth.guard")

router.post("/create-tag", checkIsAdmin, TagController.addNewTag)
router.put("/update-tag", checkIsAdmin, TagController.updateTag)
router.get("/get-all-tags", checkIsAdmin, TagController.getAllTags)
router.delete("/delete-Tag", checkIsAdmin, TagController.deleteTag)

module.exports = {
    tagRoutes: router
}