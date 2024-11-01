const {
  getExpenseListHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
  getListExpenseTypeHandler,
} = require("../controllers/expense_controller");

const router = require("express").Router();

router.get("/", getExpenseListHandler);
router.get("/types", getListExpenseTypeHandler);
router.post("/", createExpenseHandler);
router.put("/:id", updateExpenseHandler);
router.delete("/:id", deleteExpenseHandler);

module.exports = router;
