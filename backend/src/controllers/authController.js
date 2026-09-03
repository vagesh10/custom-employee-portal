const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { createAuditLog } = require("../services/auditService");
const { findUserByEmail } = require("../models/userModel");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                message: "User account is inactive",
            });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Create audit log
        await createAuditLog({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            resource: "AUTH",
            ipAddress: req.ip,
            metadata: {
                email: user.email,
            },
        });

        // Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );

        // Send response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    login,
};


