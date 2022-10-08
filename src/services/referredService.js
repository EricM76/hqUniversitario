const axios = require("axios");
const process = require("process");
const BASE_URL = "http://localhost:3000"

module.exports = {
    getTotalOfActiveReferredUsers: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/referidos/${userId}/activos`);
            
            return response.total;
        } catch (error) {
            return error;
        }
    }
}