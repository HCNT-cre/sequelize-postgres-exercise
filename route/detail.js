const express = require("express");
const router = express.Router();
const controller = require("../controller/blog");

router.get("/:id", controller.showDetail);

module.exports = router;
