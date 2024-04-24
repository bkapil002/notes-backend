const jwt = require('jsonwebtoken');
const JWD_point = "hwlobtahm";

const fetchuser = (req, res, next) => {
    const token = req.header('auth');
    
    if (!token) {
        return res.status(401).send({ error: "Please provide a valid token" });
    }

    try {
        const data = jwt.verify(token, JWD_point);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid token" });
    }
};

module.exports = fetchuser;
