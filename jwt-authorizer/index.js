const jwt = require('jsonwebtoken');
require('dotenv').config;

exports.handler = async (event) => {
    let token = event.authorizationToken;

    if(!token){
        console.log("No auth token");
        return generatePolicy
    }
    
}