const {
  dailyAnalyticHandler,
  weeklyAnalyticController,
  monthlyAnalyticHandler,
} = require("../controllers/analytic_controller");

const router = require("express").Router();

router.get("/daily", dailyAnalyticHandler);
router.get("/weekly", weeklyAnalyticController);
router.get("/monthly", monthlyAnalyticHandler);

module.exports = router;
