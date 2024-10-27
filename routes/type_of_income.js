const router = require("express").Router();

const {
  getTypeIncomeListHandler,
  createTypeIncomeHandler,
  updateTypeIncomeHandler,
  deleteTypeIncomeHandler,
} = require("../controllers/type_income_controller");

router.get("/", getTypeIncomeListHandler);
router.post("/", createTypeIncomeHandler);
router.put("/:id", updateTypeIncomeHandler);
router.delete("/:id", deleteTypeIncomeHandler);

module.exports = router;
