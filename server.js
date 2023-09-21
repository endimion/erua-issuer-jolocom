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
      // console.log(req.session.passport.user)
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
      let sessionId = req.body.sessionId;
      let userData = req.body.sessionId.userData;

      let basicAuthString =
        process.env.GATACA_APP + ":" + process.env.GATACA_PASS;
      let buff = new Buffer(basicAuthString);
      let base64data = buff.toString("base64");
      console.log(base64data);
      let options = {
        method: "POST",
        url: constants.GATACA_CERTIFY_URL,
        headers: {
          Authorization: `Basic ${base64data}`,
        },
      };

      try {
        // by setting the sessionId to "gataca_jwt" same as the variable this becomes a globaly accessible cached value
        // so all calls will use the same token until its expired

        let gatacaAuthToken = await getSessionData("gataca_jwt", "gataca_jwt");
        if (!gatacaAuthToken || isJwtTokenExpired(gatacaAuthToken)) {
          console.log(
            "severs.js makeGatacaIssueOffer will ask for new authtoken"
          );
          const gatacaTokenResponse = await axios.request(options);
          gatacaAuthToken = gatacaTokenResponse.headers.token;
          setOrUpdateSessionData("gataca_jwt", "gataca_jwt", gatacaAuthToken);
        }

        options = {
          method: "POST",
          url: constants.GATACA_CREDENTIAL_ISSUE_SESSION_URL,
          headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${gatacaAuthToken}`,
          },
          data: { group: "Academic_And_AllianceID" },
        };
        axios
          .request(options)
          .then(async function (response) {
            console.log(response.data.id);
            let issueSessionId = response.data.id;
            console.log("SERVER.js makeGatacaIssueOffer")
            console.log("SERVER.js GATACA SESSION" + issueSessionId)
            let buff = new Buffer("https%3A%2F%2Fcertify.gataca.io");
            let base64Callbackdata = buff.toString("base64");

            let qrPartialData =
              "https://gataca.page.link/credential?process=" +
              issueSessionId +
              "&callback=" +
              base64Callbackdata;
            let qrData =
              "https://gataca.page.link/?apn=com.gatacaapp&ibi=com.gataca.wallet&link=" +
              encodeURIComponent(qrPartialData);

            console.log(qrData);

            let code = qr.image(qrData, {
              type: "png",
              ec_level: "H",
              size: 10,
              margin: 10,
            });
            let mediaType = "PNG";
            let encodedQR = imageDataURI.encode(
              await streamToBuffer(code),
              mediaType
            );
            res.send({ qr: encodedQR, gatacaSession: issueSessionId});
          })
          .catch(function (error) {
            console.error(error);
            res.send({ error: error });
          });
      } catch (error) {
        console.error(error);
        res.send({ error: error });
      }
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
      await startSession(app, req, res, serverConfiguration.endpoint);
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
      res.send(await updateSession(req, res, serverConfiguration.endpoint));
    }
  );

  // this call needs to be on the end of the config as, the handle(*,*) must be last
  // otherwise the rest of the controllers are ignored
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
  server.use(["/login", `\/${constants.BASE_PATH}/login`], passportController);

  server.use("/jwks", jwksController);
  server.use("/query", searchDbController);
  server.use("/jwks", jwksController);
  server.all("*", async (req, res) => {
    return handle(req, res);
  });


});
