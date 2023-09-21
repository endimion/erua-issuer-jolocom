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

  OIDC_CLIENT: process.env.OIDC_CLIENT?process.env.OIDC_CLIENT:"erua-issuer",
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET?process.env.OIDC_CLIENT_SECRET:"b272587a-c842-4e35-9ded-09782195c198",


  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  GATACA_CERTIFY_URL: "https://nucleus.gataca.io/admin/v1/api_keys/login",
  GATACA_CREDENTIAL_ISSUE_SESSION_URL:"https://certify.gataca.io/api/v1/issuanceRequests",

  WS_URL : process.env.WS_URL?process.env.WS_URL:"https://dss.aegean.gr",
  WS_API: process.env.WS_API?process.env.WS_API:"https://dss.aegean.gr/gataca-helper"
  
});

