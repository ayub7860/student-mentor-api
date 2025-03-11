'use strict'

// eslint-disable-next-line n/no-path-concat
require('dotenv').config({ path: __dirname + '/.env' })
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  ZONE: process.env.ZONE,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  SECRET_KEY_ADMIN: process.env.SECRET_KEY_ADMIN,
  SECRET_KEY_BRANCH: process.env.SECRET_KEY_BRANCH,
  SECRET_KEY_STAFF: process.env.SECRET_KEY_STAFF,
  SECRET_KEY_SUB_MERCHANT: process.env.SECRET_KEY_SUB_MERCHANT,
  API_URL: process.env.API_URL,
  PDF_URL: process.env.PDF_URL,
  COOKIE_DOMAIN_API: process.env.COOKIE_DOMAIN_API,
  PUBLIC_DOCUMENT_PATH: process.env.PUBLIC_DOCUMENT_PATH,
  PUBLIC_SIGNATURE_DOCUMENT_PATH: process.env.PUBLIC_SIGNATURE_DOCUMENT_PATH,
  ALLOWED_URL: process.env.ALLOWED_URL,
  EASEBUZZ_IFRAME: process.env.EASEBUZZ_IFRAME,
}
