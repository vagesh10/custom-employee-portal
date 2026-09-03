const pool = require("../config/db");

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT 
            u.id,
            u.name,
            u.email,
            u.password_hash,
            u.is_active,
            r.name AS role
        FROM Users u
        LEFT JOIN UserRoles ur ON u.id = ur.user_id
        LEFT JOIN Roles r ON ur.role_id = r.id
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0];
};

const createUser = async (name, email, passwordHash) => {
    const result = await pool.query(
        `
        INSERT INTO Users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, is_active, created_at
        `,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    createUser,
};