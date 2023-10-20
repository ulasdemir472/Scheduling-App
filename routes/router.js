const express = require("express");
const controller = require("../controllers/controller");
const router = express.Router();

router.get("/", controller.getMails);
router.post("/", controller.postMail);
router.get("/send", controller.sendMail);
router.delete("/", controller.deleteAll);

module.exports = router;
