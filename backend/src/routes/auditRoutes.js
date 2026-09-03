const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
    getAuditLogs,
} = require("../controllers/auditController");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    requirePermission("VIEW_AUDIT_LOGS"),
    getAuditLogs
);

module.exports = router;