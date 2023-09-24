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
    const tableStyles = {...styles, ...stylesCustom};
    // const useStyles = makeStyles(tableStyles);

    let optionalCredentialsList = props.optionalCredentials.map(
        (credentialDef, index) => {
            return (
                <ListItem disablePadding className="credential">
                    <ListItemButton
                        className="credential-item"
                        onClick={(event) => {
                            window.location.href = props.basePath
                                ? `/${props.basePath}/issue_card?sessionId=${props.sessionId}&type=${credentialDef.type}`
                                : `/issue_card?sessionId=${props.sessionId}&type=eruaID`;
                        }}
                    >
                        <ListItemText
                            className='credential-item-text'> {`${2 + index}. ${credentialDef.name}`} </ListItemText>
                    </ListItemButton>
                </ListItem>
            );
        }
    );

    return (
        <Typography sx={{mt: 6, mb: 4}}>
            <h2 className="">
                Select one of the available credentials to Issue:
            </h2>
            <div className="inner-content">
                <Box fontWeight="fontWeightBold" display="inline">
                    <List>
                        <ListItem disablePadding className='credential'>
                            <ListItemButton
                                className="credential-item"
                                onClick={(event) => {
                                    window.location.href = props.baseUrl
                                        ? `/${props.baseUrl}/issue_card?sessionId=${props.sessionId}&type=eruaID`
                                        : `/issue_card?sessionId=${props.sessionId}&type=eruaID`;
                                }}
                            >
                                <ListItemText className='credential-item-text'> 1. ERUA-iD (AcademicID and AllianceID
                                    Credentials) </ListItemText>
                            </ListItemButton>
                        </ListItem>
                        {/* {optionalCredentialsList} */}
                    </List>
                </Box>
            </div>
        </Typography>
    );
};
export default CredentialSelectorComponent;
//export default ProceedIssuePrompt;
