const axios = require("axios");

let accessToken = null;
let accessTokenExpiresAt = 0;

const getAccessToken = async () => {
    // Reuse token if it is still valid
    if (accessToken && Date.now() < accessTokenExpiresAt) {
        return accessToken;
    }

    try {
        const response = await axios.post(
            "https://accounts.zoho.com/oauth/v2/token",
            null,
            {
                params: {
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    grant_type: "refresh_token",
                },
            }
        );

        accessToken = response.data.access_token;

        // Refresh slightly before the actual expiry
        accessTokenExpiresAt =
            Date.now() + (response.data.expires_in - 60) * 1000;

        return accessToken;
    } catch (error) {
        console.error(
            "Zoho token refresh failed:",
            error.response?.data || error.message
        );

        throw new Error("Unable to authenticate with Zoho");
    }
};

const zohoRequest = async (url, options = {}) => {
    const token = await getAccessToken();

    const response = await axios({
        url,
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Zoho-oauthtoken ${token}`,
        },
    });

    return response.data;
};

module.exports = {
    getAccessToken,
    zohoRequest,
};