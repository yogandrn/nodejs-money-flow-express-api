const router = require("express").Router();

const {
  getTypeExpenseListHandler,
  createTypeExpenseHandler,
  updateTypeExpenseHandler,
  deleteTypeExpenseHandler,
} = require("../controllers/type_expense_controller");

router.get("/", getTypeExpenseListHandler);
router.post("/", createTypeExpenseHandler);
router.put("/:id", updateTypeExpenseHandler);
router.delete("/:id", deleteTypeExpenseHandler);

module.exports = router;
