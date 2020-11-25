
const exjwt = require('express-jwt');

// INstantiating the express-jwt middleware
const jwtMW = exjwt({
    secret: process.env.secret,
    algorithms: ['HS256']
});

module.exports=jwtMW