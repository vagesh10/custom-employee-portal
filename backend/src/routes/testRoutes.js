const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");
const { zohoRequest } = require("../services/zohoService");

const router = express.Router();

router.get(
    "/people",
    authenticateToken,
    requirePermission("ACCESS_PEOPLE"),
    async (req, res) => {
        try {
            const data = await zohoRequest(
                "https://people.zoho.com/api/forms/employee/getRecords"
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            console.error(
                "Zoho People API error:",
                error.response?.data || error.message
            );

            res.status(500).json({
                success: false,
                message: "Zoho People API request failed",
                error: error.response?.data || error.message,
            });
        }
    }
);

router.get(
    "/books",
    authenticateToken,
    requirePermission("ACCESS_BOOKS"),
    async (req, res) => {
        try {
            const data = await zohoRequest(
                `${process.env.ZOHO_API_DOMAIN}/books/v3/organizations`
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            console.error(
                "Zoho Books API error:",
                error.response?.data || error.message
            );

            res.status(500).json({
                success: false,
                message: "Zoho Books API request failed",
                error: error.response?.data || error.message,
            });
        }
    }
);

module.exports = router;