const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const authenticateToken = require("./src/middleware/authMiddleware");
const testRoutes = require("./src/routes/testRoutes");
const userRoutes = require("./src/routes/userRoutes");
const auditRoutes = require("./src/routes/auditRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-logs", auditRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Custom Employee Portal API is running",
    });
});

// Current logged-in user
app.get(
    "/api/auth/me",
    authenticateToken,
    async (req, res) => {
        try {
            const result = await pool.query(
                `
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.is_active,
                    r.name AS role
                FROM Users u
                LEFT JOIN UserRoles ur
                    ON u.id = ur.user_id
                LEFT JOIN Roles r
                    ON ur.role_id = r.id
                WHERE u.id = $1
                `,
                [req.user.userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            res.json({
                user: result.rows[0],
            });
        } catch (error) {
            console.error(
                "Profile error:",
                error
            );

            res.status(500).json({
                message: "Server error",
            });
        }
    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});