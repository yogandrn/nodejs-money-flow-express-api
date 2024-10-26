const router = require("express").Router();

// routes
const typeIncomeRouter = require("./type_of_income");
const authRouter = require("./auth");
const userRouter = require("./user");
const incomeRouter = require("./income");

// middleware
const authUser = require("../middleware/auth_user");

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/types/income", typeIncomeRouter);

// middleware auth user (harus login dengan token)
router.use("/api/v1/user", authUser, userRouter);
router.use("/api/v1/income", authUser, incomeRouter);

module.exports = router;
