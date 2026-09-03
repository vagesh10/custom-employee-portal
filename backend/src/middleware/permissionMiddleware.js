const pool = require("../config/db");

const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required",
                });
            }

            const result = await pool.query(
                `
                SELECT 1
                FROM UserRoles ur
                JOIN RolePermissions rp
                    ON ur.role_id = rp.role_id
                JOIN Permissions p
                    ON rp.permission_id = p.id
                WHERE ur.user_id = $1
                AND p.name = $2
                LIMIT 1
                `,
                [req.user.userId, permissionName]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "You do not have permission to access this resource",
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);

            return res.status(500).json({
                message: "Permission check failed",
            });
        }
    };
};

module.exports = requirePermission;