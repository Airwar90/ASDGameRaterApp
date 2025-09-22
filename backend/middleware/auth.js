const db = require('../database/database');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    //bearer token
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Missing token, anauthorised"});
    }
    try {
        //verify token
        const decoded = jwt.verify(token, JWT_SECRET);        
        req.user = {id: decoded.id};
        //move execution to next part of response
        next();       
    } catch (err){
        return res.status(403).json({ message: "Invalid token" });
    }
}
module.exports = validateToken;

//source https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs