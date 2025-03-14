const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const rfs = require('rotating-file-stream')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { NODE_ENV, PORT, ALLOWED_URL, SECRET_KEY_ADMIN, COOKIE_DOMAIN_API, SECRET_KEY_BRANCH, SECRET_KEY_STAFF, SECRET_KEY_TEACHER, SECRET_KEY_STUDENT } = require('./config')
const wlogger = require('./logger')
// eslint-disable-next-line no-unused-vars
const { websiteConfigTbl, customerProductTbl, staffTbl } = require('./sequelize')
const Sequelize = require('sequelize')
// eslint-disable-next-line no-unused-vars
const Op = Sequelize.Op
const cron = require('node-cron')

const withAdminAuth = require('./adminMiddleware')
const withTeacherAuth = require('./teacherMiddleware')
const withStudentAuth = require('./studentMiddleware')

//* Include Router
const publicRoute = require('./routes/public.routes')

// admin
const adminRoute = require('./routes/admin.routes')
const adminProfileRoute = require('./routes/adminProfile.routes')
const userRoute = require('./routes/user.routes')

const teacherRoute = require('./routes/teacher.routes')
const studentRoute = require('./routes/student.routes')


function normalizePort (val) {
  const port = parseInt(val, 10)
  if (Number.isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 18000 // limit each IP to 300 requests per windowMs
})

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const allowedUrls = ALLOWED_URL.split(', ')
const corsOptions = {
  credentials: true,
  origin: allowedUrls
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 50000
  })
)
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(helmet())

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"].concat(allowedUrls)
      }
    },
    permissionsPolicy: {
      features: {
        camera: [],
        microphone: [],
        geolocation: [],
        accelerometer: [],
        gyroscope: [],
        magnetometer: [],
        usb: [],
        'interest-cohort': []
      }
    }
  })
)
app.use(
  helmet.expectCt({
    enforce: true,
    maxAge: 30
  })
)
app.use(
  helmet.xssFilter({
    setOnOldIE: true
  })
)

app.use(limiter)

//* troubleshoot log implementation
if (NODE_ENV === 'production') {
  // * Create access log file
  const accessLogStream = rfs.createStream('access.log', {
    size: '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log'),
    compress: 'gzip' // compress rotated files
  })
  // * setup the logger
  app.use(logger('combined', { stream: accessLogStream }))
} else {
  // * below line is for development purpose only
  app.use(logger('dev'))
}

//* api calling
app.get('/api/checkAdminToken', withAdminAuth, function (req, res) {
  res.json({ id: req.uid }).status(200)
})

app.get('/api/checkTeacherToken', withTeacherAuth, function (req, res) {
  res.json({ id: req.uid }).status(200)
})

app.get('/api/checkStudentToken', withStudentAuth, function (req, res) {
  res.json({ id: req.uid }).status(200)
})


app.get('/api/verifyAdminToken', function (req, res) {
  try {
    const token =
            req.cookies.admin_auth_token ||
            req.body.admin_auth_token ||
            req.query.admin_auth_token ||
            req.headers['x-access-token']
    if (!token) {
      res.status(401).send('Unauthorized: No token provided')
    } else {
      jwt.verify(token, SECRET_KEY_ADMIN, function (err, decoded) {
        if (err) {
          res.status(401).send('Unauthorized: Invalid token')
        } else {
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
          // Check if the token is expiring within the next hour (3600 seconds)
          if (expiresIn < 3600) {
            const payload = {
              uid: decoded.uid
            }
            if (NODE_ENV === 'development') {
              const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
                expiresIn: '8760h'
              })
              const cookieOptions = {
                maxAge: 31536000000,
                httpOnly: true
              }
              res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
            } else {
              const token = jwt.sign(payload, SECRET_KEY_ADMIN, {
                expiresIn: '12h'
              })
              const cookieOptions = {
                maxAge: 43200000,
                httpOnly: true
              }
              cookieOptions.domain = COOKIE_DOMAIN_API
              cookieOptions.sameSite = 'none'
              cookieOptions.secure = true
              cookieOptions.path = '/'
              res.cookie('admin_auth_token', token, cookieOptions).sendStatus(200)
            }
          } else res.status(200).json({ id: decoded.uid })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: `${err}` })
    wlogger.error(`/api/verifyAdminToken: Error: ${err}`)
  }
})

app.get('/api/verifyTeacherToken', function (req, res) {
  try {
    const token =
            req.cookies.teacher_auth_token ||
            req.body.teacher_auth_token ||
            req.query.teacher_auth_token ||
            req.headers['x-access-token']
    if (!token) {
      res.status(401).send('Unauthorized: No token provided')
    } else {
      jwt.verify(token, SECRET_KEY_TEACHER, function (err, decoded) {
        if (err) {
          res.status(401).send('Unauthorized: Invalid token')
        } else {
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
          // Check if the token is expiring within the next hour (3600 seconds)
          if (expiresIn < 3600) {
            const payload = {
              uid: decoded.uid
            }
            if (NODE_ENV === 'development') {
              const token = jwt.sign(payload, SECRET_KEY_TEACHER, {
                expiresIn: '8760h'
              })
              const cookieOptions = {
                maxAge: 31536000000,
                httpOnly: true
              }
              res.cookie('teacher_auth_token', token, cookieOptions).sendStatus(200)
            } else {
              const token = jwt.sign(payload, SECRET_KEY_TEACHER, {
                expiresIn: '12h'
              })
              const cookieOptions = {
                maxAge: 43200000,
                httpOnly: true
              }
              cookieOptions.domain = COOKIE_DOMAIN_API
              cookieOptions.sameSite = 'none'
              cookieOptions.secure = true
              cookieOptions.path = '/'
              res.cookie('teacher_auth_token', token, cookieOptions).sendStatus(200)
            }
          } else res.status(200).json({ id: decoded.uid })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: `${err}` })
    wlogger.error(`/api/verifyCoOperativeToken: Error: ${err}`)
  }
})

app.get('/api/verifyStudentToken', function (req, res) {
  try {
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
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
          // Check if the token is expiring within the next hour (3600 seconds)
          if (expiresIn < 3600) {
            const payload = {
              uid: decoded.uid
            }
            if (NODE_ENV === 'development') {
              const token = jwt.sign(payload, SECRET_KEY_STUDENT, {
                expiresIn: '8760h'
              })
              const cookieOptions = {
                maxAge: 31536000000,
                httpOnly: true
              }
              res.cookie('student_auth_token', token, cookieOptions).sendStatus(200)
            } else {
              const token = jwt.sign(payload, SECRET_KEY_STUDENT, {
                expiresIn: '12h'
              })
              const cookieOptions = {
                maxAge: 43200000,
                httpOnly: true
              }
              cookieOptions.domain = COOKIE_DOMAIN_API
              cookieOptions.sameSite = 'none'
              cookieOptions.secure = true
              cookieOptions.path = '/'
              res.cookie('student_auth_token', token, cookieOptions).sendStatus(200)
            }
          } else res.status(200).json({ id: decoded.uid })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: `${err}` })
    wlogger.error(`/api/verifyCoOperativeToken: Error: ${err}`)
  }
})

app.use('/api/publicApi', publicRoute)

///admin
app.use('/api/adminApi', withAdminAuth, adminRoute)
app.use('/api/adminProfileApi', withAdminAuth, adminProfileRoute)
app.use('/api/userApi', withAdminAuth, userRoute)

app.use('/api/teacherApi', withTeacherAuth, teacherRoute)
app.use('/api/studentApi', withStudentAuth, studentRoute)


app.get('/', async function (req, res) {
  const filePath = path.join(__dirname, './views/index.html')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  res.setHeader('Content-Type', 'text/html')
  res.end(fileContent)
})

app.get('/favicon.ico', function (req, res) {
  const options = {
    root: path.join(__dirname, './views'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  const fileName = 'favicon.ico'
  res.sendFile(fileName, options, function (err) {
    if (err) {
      wlogger.error('/favicon.ico: Error: ' + err)
    }
  })
})

app.get('/styles.min.css', function (req, res) {
  const options = {
    root: path.join(__dirname, './views'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  const fileName = 'styles.min.css'
  res.sendFile(fileName, options, function (err) {
    if (err) {
      wlogger.error('/styles.min.css: Error: ' + err)
    }
  })
})


app.use(function (req, res) {
  res.status(404).json({ error: 'Not Found' })
})

app.use(function (err, req, res, next) {
  if (err instanceof rateLimit.RateLimitExceeded) {
    res.status(429).json({ error: 'Too Many Requests' })
  } else {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
  }
})

// setBrowserInstance()

const port = normalizePort(process.env.PORT || PORT)
app.listen(port, () => {
  wlogger.info(`API listening on port:: ${port}`)
  console.log(`API listening on port: ${port}`)
})
