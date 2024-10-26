const router = require("express").Router();
const {
  userInfoHandler,
  updateProfileHandler,
  changePasswordHandler,
} = require("../controllers/user_controller");

router.get("/", userInfoHandler);
router.put("/", updateProfileHandler);
router.put("/change-password", changePasswordHandler);

module.exports = router;
