const router = require("express").Router();
const { userInfoHandler } = require("../controllers/user_controller");

router.get("/", userInfoHandler);

module.exports = router;
