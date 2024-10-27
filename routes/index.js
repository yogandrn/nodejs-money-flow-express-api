const router = require("express").Router();

// routes
const typeIncomeRouter = require("./type_of_income");
const typeExpenseRouter = require("./type_of_expense");
const authRouter = require("./auth");
const userRouter = require("./user");
const incomeRouter = require("./income");

// middleware
const authUser = require("../middleware/auth_user");
const authAdmin = require("../middleware/auth_admin");

router.use("/api/v1/auth", authRouter);

// middleware auth user (harus login dengan token)
router.use("/api/v1/user", authUser, userRouter);
router.use("/api/v1/income", authUser, incomeRouter);

// middleware auth admin (harus login dengan token dan access nya ADMIN/ROOT)
router.use("/api/v1/types/income", authAdmin, typeIncomeRouter);
router.use("/api/v1/types/expense", authAdmin, typeExpenseRouter);

module.exports = router;
