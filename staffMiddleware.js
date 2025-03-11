const jwt = require('jsonwebtoken')
const { SECRET_KEY_STAFF } = require('./config')

const withAuth = function (req, res, next) {
  const token =
    req.cookies.staff_auth_token ||
    req.body.staff_auth_token ||
    req.query.staff_auth_token ||
    req.headers['x-access-token']
  if (!token) {
    res.status(401).send('Unauthorized: No token provided')
  } else {
    jwt.verify(token, SECRET_KEY_STAFF, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token')
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

module.exports = withAuth
