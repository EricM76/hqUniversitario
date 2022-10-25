const axios = require("axios");
const process = require("process");
const BASE_URL = "http://localhost:3000"

module.exports = {
    getActivesUserCourses: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/userCourses/${userId}/actives`);
            
            return response;
        } catch (error) {
            return error;
        }
    },
}