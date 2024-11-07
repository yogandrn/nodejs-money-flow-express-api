const router = require("express").Router();

const { uploadOptions } = require("../config/file_upload");
const {
  getTypeIncomeListHandler,
  createTypeIncomeHandler,
  updateTypeIncomeHandler,
  deleteTypeIncomeHandler,
} = require("../controllers/type_income_controller");

router.get("/", getTypeIncomeListHandler);
router.post("/", uploadOptions.single("thumbnail"), createTypeIncomeHandler);
router.put("/:id", uploadOptions.single("thumbnail"), updateTypeIncomeHandler);
router.delete("/:id", deleteTypeIncomeHandler);

module.exports = router;
