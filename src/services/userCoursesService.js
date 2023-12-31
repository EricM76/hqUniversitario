const axios = require("axios");
const process = require("process");
const BASE_URL = process.env.BASE_URL;

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