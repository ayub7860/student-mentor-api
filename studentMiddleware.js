const jwt = require('jsonwebtoken')
const { SECRET_KEY_STUDENT } = require('./config')

const withAuth = function (req, res, next) {
  const token =
    req.cookies.student_auth_token ||
    req.body.student_auth_token ||
    req.query.student_auth_token ||
    req.headers['x-access-token']
  if (!token) {
    res.status(401).send('Unauthorized: No token provided')
  } else {
    jwt.verify(token, SECRET_KEY_STUDENT, function (err, decoded) {
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
