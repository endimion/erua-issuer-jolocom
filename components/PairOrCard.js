import QrPrompt from "./QrPrompt";
import SSE from "./Sse.js";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
const constants = require('../utils/consts')

const PairOrCard = (props) => {


  let finishImgUrl = //constants.BASE_PATH? `/${constants.BASE_PATH}/finished.png` :
  "/finished.png" 


  
  
  let vcSentToUser = (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <h2
          class="MuiTypography-root MuiTypography-h3"
          style={{
            color: "#4d4d4d",
            padding: "8px 0px 0px",
            fontWeight: "normal",
          }}
        >
          Issuance completed
        </h2>
        <h1
          style={{
            margin: "0px 0px 48px 0px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "30px",
            marginLeft: "0px",
            fontSize: "2rem",
          }}
        >
          Your Portable KYB Credential has been issued succesfully
        </h1>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <img
          alt=""
          src= {finishImgUrl}
          style={{
            maxWidth: "15rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
        <p
          className="MuiTypography-root  MuiTypography-body1"
          style={{ fontSize: "1.1429rem" }}
        >
         You should be able to review your credential on your Jolocom Wallet
        </p>
      </GridItem>
    </GridContainer>
  );

  if (props.vcSent) {
    return vcSentToUser;
  }
  

  if (props.qrData && !props.DID) {
    return (
      <div>
        <QrPrompt qrData={props.qrData} baseUrl={props.baseUrl} />
        <SSE
          uuid={props.uuid}
          serverSessionId={props.serverSessionId}
          sealSession={props.sealSession}
        />
      </div>
    );
  } else {
    if (props.credQROffer) {
      return (
        <div>
          <QrPrompt
            qrData={props.credQROffer}
            baseUrl={props.baseUrl}
            isVCOffer={true}
          />
          <SSE
            uuid={props.uuid}
            serverSessionId={props.serverSessionId}
            sealSession={props.sealSession}
          />
        </div>
      );
    } else {
      if (props.DID) {
        return props.card;
      } else {
        return <div>Generating Wallet Pairing Request...</div>;
      }
    }
  }
};

export default PairOrCard;
