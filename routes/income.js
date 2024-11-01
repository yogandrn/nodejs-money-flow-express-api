const {
  getIncomeListHandler,
  createIncomeHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
  getListIncomeTypeHandler,
} = require("../controllers/income_controller");

const router = require("express").Router();

router.get("/", getIncomeListHandler);
router.get("/types", getListIncomeTypeHandler);
router.post("/", createIncomeHandler);
router.put("/:id", updateIncomeHandler);
router.delete("/:id", deleteIncomeHandler);

module.exports = router;
