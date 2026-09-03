const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
    createUser,
    getUsers,
    updateUserRole,
    updateUserStatus,
} = require("../controllers/userController");

const router = express.Router();

// GET ALL USERS
router.get(
    "/",
    authenticateToken,
    requirePermission("MANAGE_USERS"),
    getUsers
);

// CREATE USER
router.post(
    "/",
    authenticateToken,
    requirePermission("MANAGE_USERS"),
    createUser
);

// UPDATE USER ROLE
router.put(
    "/:id/role",
    authenticateToken,
    requirePermission("MANAGE_USERS"),
    updateUserRole
);

// ACTIVATE / DEACTIVATE USER
router.put(
    "/:id/status",
    authenticateToken,
    requirePermission("MANAGE_USERS"),
    updateUserStatus
);

module.exports = router;