require("dotenv").config()

module.exports = Object.freeze({
  PORT: parseInt(process.env.PORT, 10) || 5030,
  NODE_ENV: process.env.NODE_ENV,
  KEY_PATH: process.env.KEY_PATH,
  CERT_PATH: process.env.CERT_PATH,
  CERT_PASS: process.env.CERT_PASS,
  ENDPOINT: process.env.ENDPOINT,
  USER_INFO: process.env.USER_INFO ? process.env.USER_INFO : "localhost",
  REDIS: process.env.REDIS ? process.env.REDIS : "localhost",
  HTTPS_COOKIES: process.env.HTTPS_COOKIES,
  BASE_PATH: process.env.BASE_PATH,
  SENDER_ID: process.env.SENDER_ID,
  CONNECTION_RESPONSE_URI: process.env.CONNECTION_RESPONSE_URI,

  USER_INFO_PORT: process.env.USER_INFO_PORT
    ? process.env.USER_INFO_PORT
    : "8180",
  ISSUER_URL: process.env.ISSUER_URL
    ? process.env.ISSUER_URL
    : "https://localhost:8081/auth/realms/erua",
  OIDC_REDIRECT_URI: process.env.OIDC_REDIRECT_URI
    ? process.env.OIDC_REDIRECT_URI
    : `http://localhost:5030/login/callback`,

  OIDC_CLIENT: process.env.OIDC_CLIENT,
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  GATACA_CERTIFY_URL: "https://nucleus.gataca.io/admin/v1/api_keys/login",
  GATACA_CREDENTIAL_ISSUE_SESSION_URL:
    "https://certify.gataca.io/api/v1/issuanceRequests",

  WS_URL: process.env.WS_URL ? process.env.WS_URL : "ws://localhost:5000",

  CHECK_USER_WORKSHOPS: process.env.CHECK_USER_WORKSHOPS
    ? process.env.CHECK_USER_WORKSHOPS
    : "https://jsonplaceholder.typicode.com/posts",
});
