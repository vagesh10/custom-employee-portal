const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { createAuditLog } = require("../services/auditService");

// CREATE USER
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message:
                    "Name, email, password and role are required",
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM Users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message:
                    "User with this email already exists",
            });
        }

        const roleResult = await pool.query(
            "SELECT id FROM Roles WHERE name = $1",
            [role]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const userResult = await pool.query(
            `
            INSERT INTO Users
                (name, email, password_hash)
            VALUES
                ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                is_active,
                created_at
            `,
            [name, email, passwordHash]
        );

        const newUser = userResult.rows[0];

        await pool.query(
            `
            INSERT INTO UserRoles
                (user_id, role_id)
            VALUES
                ($1, $2)
            `,
            [
                newUser.id,
                roleResult.rows[0].id,
            ]
        );

        await createAuditLog({
            userId: req.user.userId,
            action: "USER_CREATED",
            resource: "USER",
            ipAddress: req.ip,
            metadata: {
                createdUserId: newUser.id,
                email: newUser.email,
                role,
            },
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                ...newUser,
                role,
            },
        });
    } catch (error) {
        console.error(
            "Create user error:",
            error
        );

        res.status(500).json({
            message: "Failed to create user",
        });
    }
};

// GET USERS
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.is_active,
                u.created_at,
                r.name AS role
            FROM Users u
            LEFT JOIN UserRoles ur
                ON u.id = ur.user_id
            LEFT JOIN Roles r
                ON ur.role_id = r.id
            ORDER BY u.id
        `);

        res.json({
            users: result.rows,
        });
    } catch (error) {
        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: "Role is required",
            });
        }

        const roleResult = await pool.query(
            "SELECT id FROM Roles WHERE name = $1",
            [role]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const userResult = await pool.query(
            "SELECT id, email FROM Users WHERE id = $1",
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await pool.query(
            `
            UPDATE UserRoles
            SET role_id = $1
            WHERE user_id = $2
            `,
            [
                roleResult.rows[0].id,
                id,
            ]
        );

        await createAuditLog({
            userId: req.user.userId,
            action: "USER_ROLE_UPDATED",
            resource: "USER",
            ipAddress: req.ip,
            metadata: {
                targetUserId: Number(id),
                email: userResult.rows[0].email,
                newRole: role,
            },
        });

        res.json({
            message:
                "User role updated successfully",
        });
    } catch (error) {
        console.error(
            "Update role error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update user role",
        });
    }
};

// UPDATE USER STATUS
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                message:
                    "is_active must be true or false",
            });
        }

        const userResult = await pool.query(
            `
            SELECT id, email, is_active
            FROM Users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await pool.query(
            `
            UPDATE Users
            SET is_active = $1
            WHERE id = $2
            `,
            [is_active, id]
        );

        await createAuditLog({
            userId: req.user.userId,
            action: is_active
                ? "USER_ACTIVATED"
                : "USER_DEACTIVATED",
            resource: "USER",
            ipAddress: req.ip,
            metadata: {
                targetUserId: Number(id),
                email: userResult.rows[0].email,
            },
        });

        res.json({
            message: is_active
                ? "User activated successfully"
                : "User deactivated successfully",
        });
    } catch (error) {
        console.error(
            "Update status error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update user status",
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    updateUserRole,
    updateUserStatus,
};