import GridItem from "../Grid/GridItem";
import { makeStyles } from "@material-ui/core/styles";
import styles from "styles/jss/nextjs-material-kit/components/formStyle.js";
import stylesCustom from "styles/jss/palaemon.module.js";
//AppBar
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "next/link";

const QrPrompt = (props) => {
  const tableStyles = { ...styles, ...stylesCustom };
  const useStyles = makeStyles(tableStyles);
  const classes = useStyles();
  let thePrompt;
  let thePrompt2;
  // let topHeader;

  if (props.isVCOffer) {
    thePrompt2 = ``;
    thePrompt =
      "Tap the 'Open Wallet' button or Scan the QR to receive your ERUA ID";
    // topHeader = "PALAEMON Verifiable Credential is ready ";
  } else {
    thePrompt = `Scan the QR code with your Jolocom Wallet or Tap the button 
    to pair your Wallet`;
    thePrompt2 = ``;
    // topHeader = "Before we begin";
  }

  if (props.prompt) {
    thePrompt = props.prompt;
  }

  let walletInteraction = "";
  if (!props.isMobile) {
    walletInteraction = (
      <img
        className="img-fluid"
        style={{
          display: "block",
          margin: "auto",
          maxHeight: "21rem",
        }}
        src={props.qrData}
      />
    );
  } else {
    let deeplink = `https://jolocom.app.link/interact?token=${props.qrData}`;

    const redirecttoNativeApp = () => {
      document.location = deeplink;
    };
    walletInteraction = (
      <GridItem xs={12} sm={12} md={12}>
        <Box display="flex">
          <Box m="auto">
            <Button
              variant="contained"
              size="large"
              type="submit"
              onClick={redirecttoNativeApp}
            >
              <Link href={deeplink}>Open Wallet</Link>
              
            </Button>
          </Box>
        </Box>
      </GridItem>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h5" sx={{ mt: 6, mb: 4 }}>
        {thePrompt}
      </Typography>
      <Typography variant="h7" sx={{ mt: 6, mb: 4 }}>
        {thePrompt2}
      </Typography>
      <Box
        fontWeight="fontWeightBold"
        display="inline"
        style={{ marginTop: "1rem" }}
      >
        {walletInteraction}
      </Box>

      <Typography sx={{ mt: 6, mb: 4 }} style={{ textAlign: "center" }}>
        Do not have the Jolocom app yet? Download it form your prefered app
        store
      </Typography>
      <Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item s={3} xs={12}>
              {" "}
              <a
                href="https://apps.apple.com/us/app/jolocom-smartwallet/id1223869062"
                target="_blank"
                className="w-inline-block"
              >
                <img
                  className="img-fluid"
                  style={{ display: "block", margin: "auto" }}
                  src={
                    // props.baseUrl
                    //   ? `${props.baseUrl}/app-store.png`
                    //   : 
                      "/app-store.png"
                  }
                />
              </a>
            </Grid>
            <Grid item s={3} xs={12}>
              {" "}
              <a
                href="https://apps.apple.com/us/app/jolocom-smartwallet/id1223869062"
                target="_blank"
                className="w-inline-block"
              >
                <img
                  className="img-fluid"
                  style={{ display: "block", margin: "auto" }}
                  src={
                    // props.baseUrl
                    //   ? `${props.baseUrl}/play-store.png`
                    //   : 
                      "/play-store.png"
                  }
                />
              </a>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Box>
      </Typography>
    </React.Fragment>
  );
};

export default QrPrompt;
