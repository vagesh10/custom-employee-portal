const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.id,
                a.action,
                a.resource,
                a.ip_address,
                a.metadata,
                a.created_at,
                u.name AS user_name,
                u.email AS user_email
            FROM AuditLogs a
            LEFT JOIN Users u
                ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);

        res.json({
            logs: result.rows,
        });
    } catch (error) {
        console.error(
            "Get audit logs error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch audit logs",
        });
    }
};

module.exports = {
    getAuditLogs,
};