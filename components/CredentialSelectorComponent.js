import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "styles/jss/nextjs-material-kit/components/formStyle.js";
import stylesCustom from "../styles/jss/palaemon.module.js";
// List
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import ListItemIcon from "@mui/material/ListItemIcon";

const CredentialSelectorComponent = (props) => {
  const tableStyles = { ...styles, ...stylesCustom };
  // const useStyles = makeStyles(tableStyles);

  let ticketUrl = //props.basePath ? `/${props.basePath}/profile.svg` : 
  process.env.BASE_PATH
  ? `/${process.env.BASE_PATH}/hat.svg`: "/hat.svg";

  let optionalCredentialsList = props.optionalCredentials.map(
    (credentialDef, index) => {
      return (
        // <ListItem disablePadding className="credential">
        //   <ListItemButton
        //     className="credential-item"
        //     onClick={(event) => {
        //       window.location.href = props.basePath
        //         ? `/${props.basePath}/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`
        //         : `/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`;
        //     }}
        //   >
        //     <ListItemText className="credential-item-text">
        //       {" "}
        //       {`${1 + index}. ${credentialDef.name}`}{" "}
        //     </ListItemText>
        //   </ListItemButton>
        // </ListItem>
        <ListItem
          disablePadding
          key={credentialDef.name}
          className="credential"
        >
          <ListItemButton
            className="credential-item"
            onClick={(event) => {
              window.location.href = props.baseUrl
                ? `/${props.baseUrl}/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`
                : `/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`;
            }}
          >
            <ListItemIcon>
              {" "}
              <div className="credential-icon">
                <img src={ticketUrl} />
              </div>{" "}
            </ListItemIcon>
            <ListItemText>
              {" "}
              <span className="credential-item-text">{`${credentialDef.name}`}</span>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      );
    }
  );

  return (
    <div className="content-wrapper">
      <h2 className="">Select one of the available Credentials to Issue:</h2>
      <div className="inner-content">
        <Box fontWeight="fontWeightBold" display="inline">
          <List>{optionalCredentialsList}</List>
        </Box>
      </div>
    </div>

    // <Typography sx={{ mt: 6, mb: 4 }}>
    //   <h2 className="">Select one of the available credentials to Issue:</h2>
    //   <div className="inner-content">
    //     <Box fontWeight="fontWeightBold" display="inline">
    //       <List>
    //         {optionalCredentialsList}
    //         <ListItem disablePadding className="credential">
    //           <ListItemButton
    //             className="credential-item"
    //             onClick={(event) => {
    //               window.location.href = props.baseUrl
    //                 ? `/${props.baseUrl}/issue_card?sessionId=${props.sessionId}&type=eruaID`
    //                 : `/issue_card?sessionId=${props.sessionId}&type=eruaID`;
    //             }}
    //           >
    //             <ListItemText className="credential-item-text">
    //               {" "}
    //               3. AcademicID Credential{" "}
    //             </ListItemText>
    //           </ListItemButton>
    //         </ListItem>
    //       </List>
    //     </Box>
    //   </div>
    // </Typography>
  );
};
export default CredentialSelectorComponent;
//export default ProceedIssuePrompt;
