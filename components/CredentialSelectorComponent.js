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

const CredentialSelectorComponent = (props) => {
  const tableStyles = { ...styles, ...stylesCustom };
  // const useStyles = makeStyles(tableStyles);

  let optionalCredentialsList = props.optionalCredentials.map(
    (credentialDef, index) => {
      return (
        <ListItem disablePadding>
          <ListItemButton
            onClick={(event) => {
              window.location.href = props.basePath
                ? `/${props.basePath}/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`
                : `/issue_card?sessionId=${props.sessionId}&type=eruaID`;
            }}
          >
            <ListItemText primary={`${2 + index}. ${credentialDef.name}`} />
          </ListItemButton>
        </ListItem>
      );
    }
  );

  return (
    <Typography sx={{ mt: 6, mb: 4 }}>
      Select one of the available credentials to Issue:
      <Box fontWeight="fontWeightBold" display="inline">
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => {
                window.location.href = props.baseUrl
                  ? `/${props.baseUrl}/issue_card?sessionId=${props.sessionId}&type=eruaID`
                  : `/issue_card?sessionId=${props.sessionId}&type=eruaID`;
              }}
            >
              <ListItemText primary="1. ERUA-iD (AcademicID and AllianceID Credentials)" />
            </ListItemButton>
          </ListItem>
          {/* {optionalCredentialsList} */}
        </List>
      </Box>
    </Typography>
  );
};
export default CredentialSelectorComponent;
//export default ProceedIssuePrompt;
