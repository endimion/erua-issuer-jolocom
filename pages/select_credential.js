import React from "react";
import { withRouter, useRouter } from "next/router";

import {
  setSessionData,
  addSetToSelection,
  setStepperSteps,
  setEndpoint,
  setBaseUrl,
  setServerSessionId,
  completeDIDAuth,
  setSessionId,
  setServerPort,
  setOptionalCredentials,
} from "../store";
import { connect } from "react-redux";
import isMobile from "../utils/isMobile";
import Head from "next/head";
import LayoutNew from "../components/updated/LayoutNew";
import CredentialSelectorComponent from "../components/CredentialSelectorComponent";

class SelectCredentialPage extends React.Component {
  constructor(props) {
    super(props);
    const router = this.props.router;
    const { sessionId } = router.query;
    this.sessionId = sessionId;
    this.dispatch = props.dispatch;
    this.isFetching = props.isFetching;
    this.sessionData = props.sessionData;
    this.hasRequiredAttributes =
      props.sessionData !== null && props.sessionData !== undefined;
  }

  static async getInitialProps({ reduxStore, req, query }) {
    let userData;
    let DIDOk;
    let sessionId = req ? req.query.sessionId : query.sessionId;
    let optionalCredentials;
    if (typeof window === "undefined") {
      console.log("select_credentials.js");
      console.log(req.optionalCredentials);
      console.log("---");
      userData = req.userData;
      optionalCredentials = req.optionalCredentials;

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
    if (optionalCredentials) {
      reduxStore.dispatch(setOptionalCredentials(optionalCredentials));
    }
    if (userData) {
      reduxStore.dispatch(setSessionData(userData));
    }
    if (DIDOk) {
      reduxStore.dispatch(completeDIDAuth(sessionId));
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
      optionalCredentials: optionalCredentials,
      qrData: reduxStore.getState().qrData,
      vcSent: false,
      sessionId: reduxStore.getState().sessionId,
      endpoint: reduxStore.getState().endpoint,
      basePath: reduxStore.getState().baseUrl,
      serverPort: reduxStore.getState().serverPort,
    };
  }

  render() {
    let result = (
      <CredentialSelectorComponent
        qrData={this.props.qrData}
        DID={this.props.DID}
        baseUrl={this.props.baseUrl}
        optionalCredentials={this.props.optionalCredentials}
        sessionId={this.props.sessionId}
        uuid={this.props.uuid}
        serverSessionId={this.props.serverSessionId}
        isMobile={isMobile()}
        serverPort={this.props.serverPort}
        endpoint={this.props.endpoint}
      />
    );
    return (
      <LayoutNew home activeStep={2}>
        <Head>
          <title>ERUA Issuer</title>
        </Head>
        {result}
      </LayoutNew>
    );
  }
}
function mapStateToProps(state) {
  return {
    isFetching: state.fetching,
    qrData: state.qrData,
    sessionData: state.sessionData,
    optionalCredentials: state.optionalCredentials,
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

    makeConnectionRequest: (sessionId, baseUrl, endpoint, vcType, isMobile) => {
      dispatch(
        makeOnlyConnectionRequest(
          sessionId,
          baseUrl,
          endpoint,
          vcType,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SelectCredentialPage));
