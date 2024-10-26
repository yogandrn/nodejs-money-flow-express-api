const router = require("express").Router();
const {
  registerHandler,
  loginHandler,
} = require("../controllers/auth_controller");
const authenticate = require("../middleware/auth_user");

router.post("/register", registerHandler);
router.post("/login", loginHandler);

module.exports = router;
