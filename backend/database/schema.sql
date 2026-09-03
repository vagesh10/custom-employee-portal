-- ============================================================
-- Custom Employee Portal
-- Database Schema + Seed Data
-- PostgreSQL
-- ============================================================


-- ============================================================
-- 1. DROP TABLES
-- ============================================================
-- Useful when rebuilding the database from scratch.
-- Foreign-key dependent tables are dropped first.

DROP TABLE IF EXISTS AuditLogs CASCADE;
DROP TABLE IF EXISTS RolePermissions CASCADE;
DROP TABLE IF EXISTS UserRoles CASCADE;
DROP TABLE IF EXISTS Permissions CASCADE;
DROP TABLE IF EXISTS Roles CASCADE;
DROP TABLE IF EXISTS Users CASCADE;


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. ROLES
-- ============================================================

CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. PERMISSIONS
-- ============================================================

CREATE TABLE Permissions (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 5. USER ROLES
-- ============================================================

CREATE TABLE UserRoles (
    user_id INTEGER NOT NULL,

    role_id INTEGER NOT NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_userroles_user
        FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_userroles_role
        FOREIGN KEY (role_id)
        REFERENCES Roles(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 6. ROLE PERMISSIONS
-- ============================================================

CREATE TABLE RolePermissions (
    role_id INTEGER NOT NULL,

    permission_id INTEGER NOT NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_rolepermissions_role
        FOREIGN KEY (role_id)
        REFERENCES Roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rolepermissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES Permissions(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 7. AUDIT LOGS
-- ============================================================

CREATE TABLE AuditLogs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    action VARCHAR(100) NOT NULL,

    resource VARCHAR(100),

    ip_address VARCHAR(100),

    metadata JSONB,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_auditlogs_user
        FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 8. INDEXES
-- ============================================================

CREATE INDEX idx_users_email
ON Users(email);

CREATE INDEX idx_userroles_user_id
ON UserRoles(user_id);

CREATE INDEX idx_userroles_role_id
ON UserRoles(role_id);

CREATE INDEX idx_rolepermissions_role_id
ON RolePermissions(role_id);

CREATE INDEX idx_rolepermissions_permission_id
ON RolePermissions(permission_id);

CREATE INDEX idx_auditlogs_user_id
ON AuditLogs(user_id);

CREATE INDEX idx_auditlogs_created_at
ON AuditLogs(created_at);


-- ============================================================
-- 9. SEED ROLES
-- ============================================================

INSERT INTO Roles
    (name, description)
VALUES
    (
        'Admin',
        'Full system administration access'
    ),
    (
        'HR',
        'Human resources access'
    ),
    (
        'Sales',
        'Sales and CRM access'
    ),
    (
        'Support',
        'Customer support access'
    ),
    (
        'Finance',
        'Finance and accounting access'
    );


-- ============================================================
-- 10. SEED PERMISSIONS
-- ============================================================

INSERT INTO Permissions
    (name, description)
VALUES
    (
        'VIEW_DASHBOARD',
        'View employee portal dashboard'
    ),
    (
        'ACCESS_PEOPLE',
        'Access Zoho People'
    ),
    (
        'ACCESS_CRM',
        'Access Zoho CRM'
    ),
    (
        'ACCESS_DESK',
        'Access Zoho Desk'
    ),
    (
        'ACCESS_BOOKS',
        'Access Zoho Books'
    ),
    (
        'MANAGE_USERS',
        'Create and manage users'
    ),
    (
        'MANAGE_ROLES',
        'Manage roles'
    ),
    (
        'MANAGE_PERMISSIONS',
        'Manage permissions'
    ),
    (
        'VIEW_AUDIT_LOGS',
        'View system audit logs'
    );


-- ============================================================
-- 11. VIEW DASHBOARD FOR ALL ROLES
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
CROSS JOIN Permissions p
WHERE p.name = 'VIEW_DASHBOARD';


-- ============================================================
-- 12. HR → ZOHO PEOPLE
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
JOIN Permissions p
    ON p.name = 'ACCESS_PEOPLE'
WHERE r.name = 'HR';


-- ============================================================
-- 13. SALES → ZOHO CRM
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
JOIN Permissions p
    ON p.name = 'ACCESS_CRM'
WHERE r.name = 'Sales';


-- ============================================================
-- 14. SUPPORT → ZOHO DESK
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
JOIN Permissions p
    ON p.name = 'ACCESS_DESK'
WHERE r.name = 'Support';


-- ============================================================
-- 15. FINANCE → ZOHO BOOKS
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
JOIN Permissions p
    ON p.name = 'ACCESS_BOOKS'
WHERE r.name = 'Finance';


-- ============================================================
-- 16. ADMIN → ALL PERMISSIONS
-- ============================================================

INSERT INTO RolePermissions
    (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.name = 'Admin';


-- ============================================================
-- 17. VERIFY ROLES
-- ============================================================

SELECT
    id,
    name,
    description
FROM Roles
ORDER BY id;


-- ============================================================
-- 18. VERIFY PERMISSIONS
-- ============================================================

SELECT
    id,
    name,
    description
FROM Permissions
ORDER BY id;


-- ============================================================
-- 19. VERIFY ROLE PERMISSIONS
-- ============================================================

SELECT
    r.name AS role,
    p.name AS permission
FROM RolePermissions rp
JOIN Roles r
    ON rp.role_id = r.id
JOIN Permissions p
    ON rp.permission_id = p.id
ORDER BY
    r.id,
    p.id;