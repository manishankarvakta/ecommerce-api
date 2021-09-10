const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
          // public routes that don't require authentication
          '/api/v1/users/login',
        //   '/api/register'
        ]
      });
} 

module.exports = authJwt; 