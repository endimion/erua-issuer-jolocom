import * as React from "react";
import LayoutNew from "./LayoutNew";
import Head from "next/head";
//AppBar
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// List
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

export default function IndexForm(props) {
    let longText = "";

    return (
        <LayoutNew home activeStep={0}>
            <Head>
                <title>ERUA ISSUER</title>
            </Head>
            <div className="content-wrapper justify-left">
                <h2>
                    Welcome to the ERUA Issuer Service
                </h2>
                {/* <Typography variant="h7" sx={{ mt: 6, mb: 4 }}>
        Using this service you can generate credentials stored to your wallet
        that allow you access to the shared services of the ERUA Alliance as
        well as contain attestations of your achievements as a member of the
        alliance.
      </Typography> */}
                <Typography>
                    To access the service click the following button. You will be asked to
                    select your prefered means of authentication:
                    <Box fontWeight="fontWeightBold" display="inline">
                        <List>
                            <ListItem disablePadding>
                                <ListItemText
                                    primary="1. Your Home Instituion Credentials - for members of the ERUA Alliance"/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText
                                    primary="2. ERUA-iD - for the members of the ERUA Alliance already in possession of AcademicID and AllianceID credentials"/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="3. Your European Digital Identity"/>
                            </ListItem>
                        </List>
                    </Box>
                </Typography>

                <Typography></Typography>
                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"

                        // onClick={() => {
                        //   console.log(constants.BASE_PATH? `/${constants.BASE_PATH}/login`:"login")
                        //   window.location = props.basePath? `/${props.basePath}/login`:"login"//"/login";
                        // }}
                    >
                        <Link href="login">
                            <span style={{color: "white"}}>Access the service</span>
                        </Link>
                    </Button>
                </Box>
            </div>
        </LayoutNew>
    );
}
