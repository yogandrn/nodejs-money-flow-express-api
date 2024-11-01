const router = require("express").Router();

const { uploadOptions } = require("../config/file_upload");

const {
  userInfoHandler,
  updateProfileHandler,
  changePasswordHandler,
  uploadProfilePictureHandler,
} = require("../controllers/user_controller");

router.get("/", userInfoHandler);
router.put("/profile", updateProfileHandler);
router.put("/change-password", changePasswordHandler);
router.post(
  "/profile-picture",
  uploadOptions.single("image"),
  uploadProfilePictureHandler
);

module.exports = router;
