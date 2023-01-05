const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../auth/auth.validation");
// controllers
const {
  getUsersStats,
  getStatusStats
} = require("./analytics.controller");
// routes
router.get("/stats/statuses", authCheck, adminCheck, getStatusStats);
router.get("/stats/users", authCheck, adminCheck, getUsersStats);

module.exports = router;
