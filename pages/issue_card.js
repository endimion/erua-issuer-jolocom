import React from "react";
import { withRouter, useRouter } from "next/router";

import {
  setSessionData,
  makeGatacaIssueOffer,
  addSetToSelection,
  setStepperSteps,
  setEndpoint,
  setBaseUrl,
  setServerSessionId,
  completeDIDAuth,
  setSessionId,
  setServerPort,
  setCredentialToIssueType,
  vcSentToUser,
} from "../store";
import { connect } from "react-redux";

import isMobile from "../utils/isMobile";
import Head from "next/head";
import LayoutNew from "../components/updated/LayoutNew";
import WebsocketComp from "../components/updated/WebSocketComp";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

class IssueServiceCard extends React.Component {
  constructor(props) {
    super(props);
    this.onIssueFinished = this.onIssueFinished.bind(this);

    const router = this.props.router;
    const { sessionId } = router.query;
    this.sessionId = sessionId;
    this.dispatch = props.dispatch;
    this.isFetching = props.isFetching;
    this.sessionData = props.sessionData;
  }

  static async getInitialProps({ reduxStore, req, query }) {
    let userData;
    let DIDOk;
    let credentialToIssueType;
    let sessionId = req ? req.query.sessionId : query.sessionId;
    if (typeof window === "undefined") {
      userData = req.userData;
      credentialToIssueType = req.credentialToIssueType;

      reduxStore.dispatch(setEndpoint(req.endpoint));
      let baseUrl = req.baseUrl ? `/${req.baseUrl}/` : "";
      reduxStore.dispatch(setBaseUrl(baseUrl));
      reduxStore.dispatch(setServerSessionId(req.sessionId));
      reduxStore.dispatch(setSessionId(req.sessionId));
      DIDOk = req.DID;
      reduxStore.dispatch(setBaseUrl(req.basePath));
      reduxStore.dispatch(setServerPort(req.port));
    }

    //this way the userSessionData gets set in all settings
    if (userData) {
      reduxStore.dispatch(setSessionData(userData));
    }
    if (credentialToIssueType) {
      reduxStore.dispatch(setCredentialToIssueType(credentialToIssueType));
    }

    if (sessionId) {
      // console.log(`settting sessionId to ${sessionId}`)
      reduxStore.dispatch(setSessionId(sessionId));
      reduxStore.dispatch(setBaseUrl(req.basePath));
      reduxStore.dispatch(setServerPort(req.port));
    }

    //returned value here is getting mered with the mapstatetoprops
    // mapstatetoprops overrides these values if they match
    return {
      sessionData: userData,
      credentialToIssueType: reduxStore.getState().credentialToIssue,
      qrData: reduxStore.getState().qrData,
      gatacaSesssion: reduxStore.getState().gatacaSession,
      vcSent: false,
      sessionId: reduxStore.getState().sessionId,
      endpoint: reduxStore.getState().endpoint,
      basePath: reduxStore.getState().baseUrl,
      serverPort: reduxStore.getState().serverPort,
    };
  }

  componentDidMount() {
    //sessionId, baseUrl, endpoint, vcType, credentialType, userData,isMobile
    this.props.getGatacaIssueData(
      this.props.sessionId,
      this.props.baseUrl,
      this.props.endpoint,
      this.props.credentialToIssueType,
      this.props.sessionData,
      "eidas",
      isMobile()
    );
  }

  onIssueFinished() {
    this.props.vcSentToUser();
  }

  render() {
    let gatacaQRData = this.props.gatacaQR;

    let mainDiv = <div></div>;

    if (this.props.vcSent)
      mainDiv = (
        <Typography variant="body2" sx={{ mt: 4 }}>
          <Box align="center">
            The Credential you requested has been issued. You will receive a notification in your wallet shortly. 
          </Box>
        </Typography>
      );

    if (!this.props.vcSent)
      mainDiv = this.props.isFetching ? (
        <Typography sx={{ mt: 6, mb: 4 }} align="center">
          Your Credential is being generated, please wait....
          <Box fontWeight="fontWeightBold" display="inline">
            <img
              alt=""
              src="/loader2.gif"
              style={{
                maxWidth: "15rem",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </Box>
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ mt: 4 }}>
          <img
            className="img-fluid"
            style={{
              display: "block",
              margin: "auto",
              maxHeight: "21rem",
            }}
            src={gatacaQRData}
          />
          <Box align="center">
            Don't have a Wallet yet? Follow the next steps:
          </Box>
          <Box sx={{ mt: 2, ml: 10 }}>
            <Box>
              <b>Step 1</b> Download the GATACA Wallet app.{" "}
              <a href="https://play.google.com/store/apps/details?id=com.gataca.identity">
                Play
              </a>{" "}
              or{" "}
              <a href="https://apps.apple.com/us/app/gataca/id1498607616">
                App
              </a>{" "}
              store
            </Box>
            <Box>
              <b>Step 2</b> With the GATACA Wallet, scan the QR code on the left
              to accept the Credential on your mobile device.
            </Box>
          </Box>

          <br />
          <WebsocketComp
            sessionId={this.props.gatacaSession}
            onIssueFinished={this.onIssueFinished}
            userData = {this.props.sessionData}
            issueTemplate={this.props.credentialToIssueType}
          />
        </Typography>
      );

    return (
      <LayoutNew home activeStep={3}>
        <Head>
          <title>ERUA Issuer</title>
        </Head>

        {mainDiv}

        {}
      </LayoutNew>
    );
  }
}
function mapStateToProps(state) {
  return {
    isFetching: state.fetching,
    qrData: state.qrData,
    sessionData: state.sessionData,
    
    userSelection: state.userSelection, // the attributes selected by the user to be included in a VC,
    baseUrl: state.baseUrl,
    DID: state.DID,
    serverSessionId: state.serverSessionId,
    uuid: state.uuid,
    vcSent: state.vcSent,
    sessionId: state.sessionId,
    endpoint: state.endpoint,
    credQROffer: state.credQROffer,
    serverPort: state.serverPort,
    credentialToIssueType: state.credentialToIssue,
    gatacaQR: state.gatacaQR,
    gatacaSession: state.gatacaSession,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEidasToSelection: (set) => {
      dispatch(addSetToSelection(set));
    },
    setSteps: (steps) => {
      dispatch(setStepperSteps(steps));
    },
    setEndPoint: (endpont) => {
      dispatch(setEndpoint(endpoint));
    },

    getGatacaIssueData: (
      sessionId,
      baseUrl,
      endpoint,
      vcType,
      credentialType,
      userData,
      isMobile
    ) => {
      dispatch(
        makeGatacaIssueOffer(
          sessionId,
          baseUrl,
          endpoint,
          vcType,
          credentialType,
          userData,
          isMobile
        )
      );
    },

    didAuthOK: (uuid) => {
      dispatch(completeDIDAuth(uuid));
    },
    setBaseUrl: (url) => {
      dispatch(setBaseUrl(url));
    },
    setServerPort: (port) => {
      dispatch(setServerPort(port));
    },

    vcSentToUser: () => {
      dispatch(vcSentToUser());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IssueServiceCard));
