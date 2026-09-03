const pool = require("../config/db");

const createAuditLog = async ({
    userId = null,
    action,
    resource = null,
    ipAddress = null,
    metadata = null,
}) => {
    try {
        await pool.query(
            `
            INSERT INTO AuditLogs
                (user_id, action, resource, ip_address, metadata)
            VALUES
                ($1, $2, $3, $4, $5)
            `,
            [
                userId,
                action,
                resource,
                ipAddress,
                metadata,
            ]
        );
    } catch (error) {
        console.error("Audit log error:", error);
    }
};

module.exports = {
    createAuditLog,
};