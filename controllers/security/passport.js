// Part 0 GRIDS specific

// Part 1, import dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Strategy, discoverAndCreateClient } = require("passport-curity");
const https = require("https");
const jose = require("node-jose");
const fs = require("fs");
const constants = require("../../utils/consts");


// Part 3, create a JWKS
const keyStore = jose.JWK.createKeyStore();
keyStore
  .generate("RSA", 2048, { alg: "RSA-OAEP-256", use: "enc" })
  .then((result) => {
    fs.writeFileSync(
      "keys.json",
      JSON.stringify(keyStore.toJSON(true), null, "  ")
    );
  });

// Part 4, configuration of Passport
const getConfiguredPassport = async (
  isProduction,
  serverEndpoint,
  claims = {}
) => {
  let _issuer_url = constants.ISSUER_URL;

  let _redirect_uri = isProduction
    ? constants.OIDC_REDIRECT_URI
    : `http://localhost:5030/login/callback`;

  const clinteId = constants.OIDC_CLIENT; //"erua-issuer"
  const clientSecret = constants.OIDC_CLIENT_SECRET; //"b272587a-c842-4e35-9ded-09782195c198"

  // Part 4b, discover Curity Server metadata and configure the OIDC client
  const client = await discoverAndCreateClient({
    issuerUrl: _issuer_url,
    clientID: clinteId,
    clientSecret: clientSecret,
    redirectUris: [_redirect_uri],
  });

  let _user_info_request = constants.USER_INFO;
  let _user_info_port = constants.USER_INFO_PORT;
  // Part 4c, configure the passport strategy
  addClaimsToStrategy(
    claims,
    passport,
    _user_info_request,
    _user_info_port,
    client
  );

  // Part 4e, tell passport how to serialize and deserialize user data
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

 

  router.use(passport.initialize());
  router.use(passport.session());
  // Part 2, configure authentication endpoints
  // router.get("/", passport.authenticate("curity")); //listens to /login
  // router.post("/", passport.authenticate("curity")); //listens to /login
  router.get(
    "/",
    passport.authenticate("curity", {
      successRedirect: "/" + constants.BASE_PATH + "/login_success",
      failureRedirect: "/" + constants.BASE_PATH + "/login_failure",
    })
  ); //listens to /login
  router.post(
    "/",
    passport.authenticate("curity", {
      successRedirect: "/" + constants.BASE_PATH + "/login_success",
      failureRedirect: "/" + constants.BASE_PATH + "/login_failure",
    })
  ); //listens to /login

  router.get(
    "/callback",
    async (req, res, next) => {
      next();
    },
    passport.authenticate("curity", {
      successRedirect: "/" + constants.BASE_PATH + "/login_success",
      failureRedirect: "/" + constants.BASE_PATH + "/login",
    }), //listens to /login/callback

    async (req, res) => {
      console.log("passport.js:: will now redirect to the view");

      console.log("PASSPORT.JS REQ.USEr");
      console.log(req.user);
      let redirect_uri = "/login_success";

      console.log(`passport.js:: will redirect to ${redirect_uri}`);
      res.redirect(redirect_uri);
    }
  );
  return { passport: passport, client: client };
};


const addClaimsToStrategy = (
  claims,
  passport,
  _user_info_request,
  _user_info_port,
  client,
  jwt = null
) => {
  let finalParams = {
    scope: "openid profile",
  };

  const strategy = new Strategy(
    {
      client,
      params: finalParams,
      fallbackToUserInfoRequest: true,
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        return cb(null, { profile });
      } catch (err) {
        console.log(err);
        return cb(null, { error: err });
      }
    }
  );

  // Part 4d, tell passport to use the strategy
  passport.use(strategy);
};

// Part 4, export objects
exports = module.exports;
exports.getConfiguredPassport = getConfiguredPassport;
exports.passportController = router;
exports.addClaimsToStrategy = addClaimsToStrategy;
