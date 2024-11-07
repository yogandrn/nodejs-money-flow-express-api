const router = require("express").Router();

const { uploadOptions } = require("../config/file_upload");
const {
  getTypeExpenseListHandler,
  createTypeExpenseHandler,
  updateTypeExpenseHandler,
  deleteTypeExpenseHandler,
} = require("../controllers/type_expense_controller");

router.get("/", getTypeExpenseListHandler);
router.post("/", uploadOptions.single("thumbnail"), createTypeExpenseHandler);
router.put("/:id", uploadOptions.single("thumbnail"), updateTypeExpenseHandler);
router.delete("/:id", deleteTypeExpenseHandler);

module.exports = router;
