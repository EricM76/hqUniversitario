const axios = require("axios");
const process = require("process");
const BASE_URL = process.env.BASE_URL;

module.exports = {
    getUserMembershipData: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/membresias/usuario/${userId}`);
            
            return response.data;
        } catch (error) {
            return error;
        }
    },
    getMembershipData: async (membershipId) => {
        try {
            const response = await axios.get(`${BASE_URL}/membresias/obtener/${membershipId}`);
            
            return response.data;
        } catch (error) {
            return error;
        }
    },
}