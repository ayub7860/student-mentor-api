const jwt = require('jsonwebtoken')
const { SECRET_KEY_BRANCH } = require('./config')

const withAuth = function (req, res, next) {
  const token =
    req.cookies.branch_auth_token ||
    req.body.branch_auth_token ||
    req.query.branch_auth_token ||
    req.headers['x-access-token']
  if (!token) {
    res.status(401).send('Unauthorized: No token provided')
  } else {
    jwt.verify(token, SECRET_KEY_BRANCH, function (err, decoded) {
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
