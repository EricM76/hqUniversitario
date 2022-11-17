const axios = require("axios");
const process = require("process");
const BASE_URL = process.env.BASE_URL;

module.exports = {
    getUserInSessionData: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/usuario/sesion`);
            
            return response.data;
        } catch (error) {
            console.log(error)
            return error;
        }
    },
}