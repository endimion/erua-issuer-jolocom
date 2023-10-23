import { v4 as uuidv4 } from "uuid";
import { getSessionData, setOrUpdateSessionData } from "../services/redis";
const constants = require("../utils/consts");

const landingPage = async (app, req, res) => {
  return app.render(req, res, "/", req.query);
};

const verifyUserDetailsPage = async (app, req, res, serverEndpoint) => {
  let {
    family_name,
    given_name,
    eduPersonUniqueId,
    email,
    schacHomeOrganization,
    eduPersonAffiliation,
  } = req.session.passport.user.profile;
  if (family_name) req.sessionId = uuidv4();

  let userDetails = {
    Name: given_name.toUpperCase(),
    Surname: family_name.toUpperCase(),
    email: email,
    eduPersonUniqueId: eduPersonUniqueId,
    schacHomeOrganization: schacHomeOrganization,
    eduPersonAffiliation: eduPersonAffiliation,
  };

  setOrUpdateSessionData(req.sessionId, "userDetails", userDetails);

  req.endpoint = serverEndpoint;
  req.userDetails = userDetails;
  req.basePath = constants.BASE_PATH;
  // console.log(req.basePath)

  return app.render(req, res, "/verify-user", req.query);
};

const selectCredentialtoIssue = async (app, req, res, serverEndpoint) => {
  req.userData = req.session.passport.user;
  req.sessionId = req.query.sessionId;
  req.endpoint = serverEndpoint;
  req.basePath = constants.BASE_PATH;

  // TODO
  // API call to see what Credentials the user is allowed to Issue
  req.optionalCredentials = [
    { type: "Student_ID", name: "ERUA Alliance: Student-ID" },
    { type: "Alliance_ID", name: "ERUA Alliance: Alliance-ID" },
    { type: "eruaID", name: "ERUA Alliance: Academic-ID" },
  ];

  console.log("view-controllers:: issueSserviceCard");
  console.log("userData");
  console.log(req.userData);

  // let claims = defaultClaims;
  let redirectURI = constants.CONNECTION_RESPONSE_URI
    ? constants.CONNECTION_RESPONSE_URI
    : "http://localhost:5030/connection_response";

  return app.render(req, res, "/select_credential", req.query);
};

const issueServiceCard = async (app, req, res, serverEndpoint) => {
  req.userData = req.session.passport.user;
  req.sessionId = req.query.sessionId;
  req.credentialToIssueType = req.query.type;
  req.endpoint = serverEndpoint;
  req.basePath = constants.BASE_PATH;
  console.log("view-controllers:: issueSserviceCard");
  console.log("userData");
  console.log(req.userData);

  // let claims = defaultClaims;
  let redirectURI = constants.CONNECTION_RESPONSE_URI
    ? constants.CONNECTION_RESPONSE_URI
    : "http://localhost:5030/connection_response";

  return app.render(req, res, "/issue_card", req.query);
};

const encode = function (unencoded) {
  return new Buffer(unencoded || "").toString("base64");
};
const urlEncode = function (unencoded) {
  const encoded = encode(unencoded);
  return encoded.replace(/\+/g, "-").replace(/\//, "_").replace(/=+$/, "");
};

export {
  selectCredentialtoIssue,
  landingPage,
  verifyUserDetailsPage,
  // ticketInfo,
  issueServiceCard,
};
