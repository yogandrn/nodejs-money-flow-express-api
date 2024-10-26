const {
  getTypeIncomeListHandler,
} = require("../controllers/type_income_controller");

const router = require("express").Router();

router.get("/", getTypeIncomeListHandler);

module.exports = router;
