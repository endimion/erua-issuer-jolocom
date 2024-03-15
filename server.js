import { getSessionConfg, getCacheStore } from "./config/sessionConf";
import { configServer } from "./config/serverConfig";
import {
  landingPage,
  verifyUserDetailsPage,
  issueServiceCard,
  selectCredentialtoIssue,
} from "./controllers/views-controllers";
import { jwksController } from "./controllers/jwks-controllers";
import { subscribe } from "./services/sse-service";
import { searchDbController } from "./controllers/seach-db-controllers";
import axios from "axios";
import { getSessionData, setOrUpdateSessionData } from "./services/redis";

// import winston from "winston";
// import expressWinston from "express-winston";
const express = require("express");

// QR Generation
const qr = require("qr-image");
const imageDataURI = require("image-data-uri");
import { streamToBuffer } from "@jorgeferrero/stream-to-buffer";
// JWT stuff needed for Gataca
import isJwtTokenExpired, { decode } from "jwt-check-expiry";
//
const https = require("https");
const next = require("next");
const constants = require("./utils/consts");
const bodyParser = require("body-parser");
const session = require("express-session");
const dev = constants.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const cookieParser = require("cookie-parser");
const { passportController } = require("./controllers/security/passport");
const path = require('path'); // Add this line to require the path module

// server session cache config
const isProduction = constants.NODE_ENV === "production";
const SESSION_CONF = getSessionConfg(isProduction);

//Configure and Start the server
let serverConfiguration = { endpoint: "" };

app.prepare().then(async () => {
  const server = express();
  server.set("trust proxy", 1); // trust first proxy
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json({ type: "*/*" }));
  server.use(session(SESSION_CONF));
  server.use(cookieParser());


  // server.use('/_next', express.static(path.join(__dirname, '.next')))

  //CONTROLLERS

  //sse
  server.get(
    ["/issuer-events", `\/${constants.BASE_PATH}/issuer-events`],
    subscribe
  );

  //view
  server.get(
    ["/", "/register", `\/${constants.BASE_PATH}/`],
    async (req, res) => {
      console.log("/register");
      return landingPage(app, req, res, serverConfiguration.endpoint);
    }
  );

  server.get(
    ["/login_success", `\/${constants.BASE_PATH}/login_success`],
    async (req, res) => {
      console.log("/login_success");
      console.log(req.session.passport.user);
      return verifyUserDetailsPage(app, req, res, serverConfiguration.endpoint);
    }
  );

  server.post(["/generate-qr"], async (req, res) => {
    console.log("/generate-qr");
    return getQRCode(req, res, serverConfiguration.endpoint);
  });

  server.get(
    [
      "/issue_card",
      "/issue",
      `\/${constants.BASE_PATH}/issue`,
      `\/${constants.BASE_PATH}/issue_card`,
    ],
    async (req, res) => {
      console.log("server.js /issue");
      // console.log(req.session.passport.user); //works ok to fetch the userdetails
      req.port = constants.PORT;
      issueServiceCard(app, req, res, serverConfiguration.endpoint);
    }
  );

  server.get(
    ["/select_credential", `\/${constants.BASE_PATH}/select_credential`],
    async (req, res) => {
      console.log("server.js /select_credential");
      req.port = constants.PORT;
      selectCredentialtoIssue(app, req, res, serverConfiguration.endpoint);
    }
  );

  // **********************************

  //gataca
  //TODO move this into a service
  server.post(
    ["/makeGatacaIssueOffer", `\/${constants.BASE_PATH}/makeGatacaIssueOffer`],
    async (req, res) => {
      console.log("server.js /makeGatacaIssueOffer");
      let credentialType = req.body.credentialType;
      console.log("makeGatacaIssueOffer credentialType");
      console.log(credentialType);
      let basicAuthString;
      let cacheVariable;
      let gatacaIssuanceTemplate;

      // default
      gatacaIssuanceTemplate = "Academic_And_AllianceID";
      // else check cases
      if (credentialType === "Alliance_ID") {
        gatacaIssuanceTemplate = "AllianceID_Issuance";
      }
      if (credentialType === "Student_ID") {
        gatacaIssuanceTemplate = "StudentID_Issuance";
      }
      if (credentialType === "EDUCATIONAL_ID") {
        gatacaIssuanceTemplate = "EDUCATIONAL_ID";
      }

      let requestURI = process.env.WS_API
        ? process.env.WS_API + "/makeIssueOffer/" + gatacaIssuanceTemplate
        : "https://dss.aegean.gr/gataca-helper" +
          "/makeIssueOffer/" +
          gatacaIssuanceTemplate;
      //"http://localhost:5000" + "/makeIssueOffer/" + gatacaIssuanceTemplate;

      console.log(`server.js: will make a request to ${requestURI}`);

      const response = await fetch(requestURI, {
        cache: "no-cache",
      });
      console.log("making new issuance session... ");
      const responseData = await response.json();
      console.log("111111111");
      console.log(responseData);

      res.send({
        qr: responseData.qr,
        deepLink: responseData.deepLink,
        gatacaSession: responseData.gatacaSession,
      });
    }
  );
  // **********************************

  // session
  server.post(
    [
      "/start-session",
      "/palaemon/start-session",
      `\/${constants.BASE_PATH}/start-session`,
    ],
    async (req, res) => {
      console.log("/start-session");
      try {
        await startSession(app, req, res, serverConfiguration.endpoint);
      } catch (err) {
        console.log(err);
      }
    }
  );

  server.post(
    [
      "/update-session",
      "/palaemon/update-session",
      `\/${constants.BASE_PATH}/update-session`,
    ],
    async (req, res) => {
      console.log("/update-session ");
      try {
        res.send(await updateSession(req, res, serverConfiguration.endpoint));
      } catch (err) {
        console.log(err);
        res.send(null);
      }
    }
  );

  // this call needs to be on the end of the config as, the handle(*,*) must be last
  // otherwise the rest of the controllers are ignored
  try {
    let { endpoint, passport, client } = await configServer(
      server,
      https,
      constants.PORT, //port,
      isProduction,
      handle,
      serverConfiguration
    );
    let serverPassport = passport;
    let oidcClient = client;
    // grids login flow, all /login*.* uris will be handles by the passportController router
    server.use(
      ["/login", `\/${constants.BASE_PATH}/login`],
      passportController
    );

    server.use("/jwks", jwksController);
    server.use("/query", searchDbController);
    
    server.all("*", async (req, res) => {
      return handle(req, res);
    });



  } catch (err) {
    console.log(err);
  }
});
