import * as React from "react";
import LayoutNew from "./LayoutNew";
//AppBar
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//Stepper
import Button from "@mui/material/Button";
import Link from "next/link";

//Card

//Forms

//Icons

//Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
// List

function mapName(name) {
  switch (name) {
    case "Identifier":
      return "eID Identifier";
      break;
    default:
      return name;
  }
}

function createData(variabl, value) {
  return { variabl, value };
}

const VerifyUser = (props) => {
  let userDetails = props.userDetails;
  let sessionId = props.sessionId;
  let link = "issue_card?sessionId=" + sessionId;
  // ? props.userDetails:{
  //   Name: "Nikos",
  //   Surname: "Triantafyllou",
  //   Identifier: "1231",
  // }

  const rows = [];

  Object.keys(props.userDetails).forEach((attributeName) => {
    rows.push(
      createData(mapName(attributeName), props.userDetails[attributeName])
    );
  });

  let contunueLink = `/issue_card?sessionId=${props.sessionId}`;

  return (
    <LayoutNew home alert={!props.userDetails} activeStep={1}>
      <>
        <Typography variant="h5" sx={{ mt: 6, mb: 4 }}>
          Before we continue, Is your Personal Information accurate?
        </Typography>
        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.variabl}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box fontWeight="fontWeightBold" display="inline">
                      {row.variabl}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>

      <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          variant="contained"
          size="large"
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            console.log(props.userDetails);
            //window.location.href = props.basePath? `/${props.basePath}/issue_card?sessionId=${props.sessionId}`:`/issue_card?sessionId=${props.sessionId}`;
            window.location.href = props.basePath
              ? `/${props.basePath}/select_credential?sessionId=${props.sessionId}`
              : `/select_credential?sessionId=${props.sessionId}`;
          }}
        >
          {/* <Link href={contunueLink}>Continue</Link> */}
          Continue
        </Button>
      </Box>
    </LayoutNew>
  );
};

export default VerifyUser;
