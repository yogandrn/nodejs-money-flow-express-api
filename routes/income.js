const {
  getIncomeListHandler,
  createIncomeHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
} = require("../controllers/income_controller");

const router = require("express").Router();

router.get("/", getIncomeListHandler);
router.post("/", createIncomeHandler);
router.put("/:id", updateIncomeHandler);
router.delete("/:id", deleteIncomeHandler);

module.exports = router;
