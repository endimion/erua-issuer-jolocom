import React from "react";
import axios from "axios";
import {
  setSessionData,
  makeOnlyConnectionRequest,
  addSetToSelection,
  setStepperSteps,
  setEndpoint,
  setBaseUrl,
  setServerSessionId,
  completeDIDAuth,
  makeSealSession,
  makeSealSessionWithDIDConnecetionRequest,
  setSealSession,
  setEidasUriPort,
  setEidasRedirectUri,
} from "../../../store";
import {vcTypes} from "../../../config/vcTypes"
import Layout from "../../../components/Layout";
import { connect } from "react-redux";
import { Button, Row, Col, Card, Container } from "react-bootstrap";
import MyStepper from "../../../components/Stepper";
import HomeButton from "../../../components/HomeButton";
import IssueVCButton from "../../../components/IssueVCButton";
import PairOrCard from "../../../components/PairOrCard";
import ConnectMobile from "../../../components/ConnectMobile";
import isMobile from "../../../utils/isMobile";

/*
  Secure flow:
  - check in session if DID is present. This is not only the DID of the user but the whole connection response
  - if it is not present:
    - first display DID connection request (QR etc.). The DID response endpoint should contain the session here
    - on response on the server, send a SSE to the front end, denoting that DID auth is completed and on the server there is the DID component
    - Display additional datasources
    - on VC issance request, do not display QR code etc, but send the credentials straigth to the users wallet

*/

class IssueEidas extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.isFetching = props.isFetching;
    this.sessionData = props.sessionData;
    this.proceedWithEidasAuth = this.proceedWithEidasAuth.bind(this);
    this.hasRequiredAttributes =
      props.sessionData !== null &&
      props.sessionData !== undefined &&
      props.sessionData.eidas !== undefined;
  }

  static async getInitialProps({ reduxStore, req }) {
    let userSessionData;
    let DIDOk;
    let sealSession;
    if (typeof window === "undefined") {
      userSessionData = req.session.userData;
      reduxStore.dispatch(setEndpoint(req.session.endpoint));
      let baseUrl = req.session.baseUrl ? `/${req.session.baseUrl}/` : "";
      reduxStore.dispatch(setBaseUrl(baseUrl));
      reduxStore.dispatch(setServerSessionId(req.session.id));
      DIDOk = req.session.DID;
      sealSession = req.session.sealSession;
      reduxStore.dispatch(setEidasUriPort(req.eidasUri, req.eidasPort));
      reduxStore.dispatch(setEidasRedirectUri(req.eidasRedirectUri));
    } else {
      if (reduxStore.getState().sessionData) {
        userSessionData = reduxStore.getState().sessionData;
        DIDOk = reduxStore.getState().DID;
        //if ther is sessionData then there should be a session as well
        sealSession = reduxStore.getState().sealSession;
      } else {
        console.log(`no server session data found`);
      }
    }

    //this way the userSessionData gets set in all settings
    if (userSessionData) {
      reduxStore.dispatch(setSessionData(userSessionData));
    }
    if (DIDOk) {
      reduxStore.dispatch(completeDIDAuth(sealSession));
    }
    if (sealSession) {
      reduxStore.dispatch(setSealSession(sealSession));
    }

    //returned value here is getting mered with the mapstatetoprops
    // mapstatetoprops overrides these values if they match
    return {
      sessionData: userSessionData,
      qrData: reduxStore.getState().qrData,
      vcSent: false,
      sealSession: reduxStore.getState().sealSession,
    };
  }

  componentDidMount() {
    if (this.props.sessionData && this.props.sessionData.eidas) {
      
      //TODO clean this up
      let toSelect = [this.props.sessionData.eidas];
      this.props.setEidasToSelection(toSelect);
      /// 
    }

    if (!this.props.DID) {
      //if DID auth has not been completed
      if (!this.props.sealSession) {
        // console.log("startSealSessionAndDidAuth")
        console.log(`isMobile ${isMobile()}`);
        this.props.startSealSessionAndDidAuth(
          this.props.baseUrl,
          "eidas",
          isMobile()
        ); //and then makeConnectionRequest
      } else {
        // console.log("makeConnectionRequest")
        console.log(`isMobile ${isMobile()}`);
        this.props.makeConnectionRequest(
          this.props.sealSession,
          this.props.baseUrl,
          "eidas",
          isMobile()
        );
      }
    }
  }

  componentDidUpdate() {
    if (this.props.DID & !this.hasRequiredAttributes) {
      //if DID auth is completed
      // register the callbackUri to the SessionManager
      let postUrl = this.props.baseUrl?`${this.props.baseUrl}seal/update-session`:"/seal/update-session"
      axios
        .post(postUrl, {
          sessionId: this.props.sealSession,
          variableName: "ClientCallbackAddr",
          variableValue: this.props.eidasRedirectUri,
        })
        .then((data) => {
          console.log("eidas.js:: session updated");
        });
    }
  }

  proceedWithEidasAuth() {
    //make msToken
    console.log("proceedWithEidasAuth ");
    axios
      .get(
        `${this.props.baseUrl}/seal/make-eidas-token?sessionId=${this.props.sealSession}`
      )
      .then((data) => {
        console.log(`proceedWithEidasAuth the data is::`);
        console.log(data);

        window.location.href = `https://${this.props.eidasUri}:${this.props.eidasPort}/eidas-idp/is/query?msToken=${data.data.additionalData}`;
        return null;
      });
  }

  render() {
    let stepNumber = this.props.vcSent
      ? 2
      : !this.props.DID
      ? 0
      : this.hasRequiredAttributes
      ? 2
      : 1;
    let stepperSteps = [
      { title: "Pair your wallet" },
      { title: 'Authenticate over "eIDAS-eID"' },
      { title: "Request Issuance" },
    ];

    if (this.props.qrData && isMobile() && !this.props.DID) {
      return (
        <Layout>
          <Row>
            <Col>
              <MyStepper steps={stepperSteps} activeNum={stepNumber} />
            </Col>
          </Row>
          <ConnectMobile
            baseUrl={this.props.baseUrl}
            qrData={this.props.qrData}
            DID={this.props.DID}
            uuid={this.props.uuid}
            serverSessionId={this.props.serverSessionId}
            sealSession={this.props.sealSession}
          />
        </Layout>
      );
    }

    let eIDASLoginButton = !this.hasRequiredAttributes ? (
      <Button onClick={this.proceedWithEidasAuth}>eIDAS</Button>
    ) : (
      <Button variant="primary" disabled>
        eIDAS
      </Button>
    );

    let issueVCBut = (
      <IssueVCButton
        hasRequiredAttributes={this.hasRequiredAttributes}
        // vcIssuanceEndpoint={"/issueVCSecure"}
        baseUrl={this.props.baseUrl}
        // user attributes are not required as they are already in the backend
        // only the type of the VC should be provided here
        // vcAttributes={this.props.userSelection}
        uuid={this.props.sealSession}
        vcType={vcTypes.eidas}
      />
    );

    let eidasCard = (
      <Card className="text-center" style={{ marginTop: "2rem" }}>
        <Card.Header>Issue an eIDAS based Verifiable Credential</Card.Header>
        <Card.Body>
          <Card.Title>
            {this.hasRequiredAttributes
              ? "Credentials Issuance is ready!"
              : "Please authenticate to the required data sources"}
          </Card.Title>
          <Card.Text>
            Once you have authenticated through the required data sources, click
            the "Issue" button to generate and receive your VC .
          </Card.Text>
          <Container>
            <Row>
              <Col>{eIDASLoginButton}</Col>
              <Col>{issueVCBut}</Col>
            </Row>
          </Container>
        </Card.Body>
        {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
      </Card>
    );

    let result = (
      <PairOrCard
        qrData={this.props.qrData}
        DID={this.props.DID}
        baseUrl={this.props.baseUrl}
        uuid={this.props.uuid}
        serverSessionId={this.props.serverSessionId}
        card={eidasCard}
        vcSent={this.props.vcSent}
        sealSession={this.props.sealSession}
        credQROffer={this.props.credQROffer}
      />
    );

    return (
      <Layout>
        <Row>
          <Col>
            <MyStepper steps={stepperSteps} activeNum={stepNumber} />
          </Col>
        </Row>
        {result}

        <Row>
          <HomeButton baseUrl={this.props.baseUrl} />
        </Row>
      </Layout>
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
    sealSession: state.sealSession,
    eidasUri: state.eidasUri,
    eidasPort: state.eidasPort,
    endpoint: state.endpoint,
    eidasRedirectUri: state.eidasRedirectUri,
    credQROffer: state.credQROffer,
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
    makeConnectionRequest: (sealSession, baseUrl, vcType, isMobile) => {
      dispatch(
        makeOnlyConnectionRequest(sealSession, baseUrl, vcType, isMobile)
      );
    },
    didAuthOK: (uuid) => {
      dispatch(completeDIDAuth(uuid));
    },
    startSealSession: (baseUrl) => {
      dispatch(makeSealSession(baseUrl));
    },
    startSealSessionAndDidAuth: (baseUrl, vcType, isMobile) => {
      dispatch(
        makeSealSessionWithDIDConnecetionRequest(baseUrl, vcType, isMobile)
      );
    },
    setTheSealSession: (sessionId) => {
      dispatch(setSealSession(sessionId));
    },
    setEidas: (uri, data) => {
      dispatch(setEidasUriPort(uri, data));
    },

    setEidasRedirect: (uri) => {
      dispatch(setEidasRedirectUri(uri));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueEidas);
