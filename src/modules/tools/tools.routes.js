// multer
const multer = require('multer');
const sharp = require('sharp');
// router
const router = require("express").Router();
// Configure multer storage
const { ToolsController } = require('./tools.controller')
// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/decrease-image-resolution', upload.single('image'), ToolsController.decreaseImageResolution);

module.exports = {
  toolsRoutes: router
}