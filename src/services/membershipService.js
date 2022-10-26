const axios = require("axios");
const process = require("process");
const BASE_URL = process.env.BASE_URL;

module.exports = {
    getUserMembershipData: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/membresias/usuario/${userId}`);
            
            return response;
        } catch (error) {
            return error;
        }
    },
}