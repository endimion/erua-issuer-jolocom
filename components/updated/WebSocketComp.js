import { useEffect, useState } from "react";
import io from "socket.io-client";
import React from "react";
import consts from "../../utils/consts";
import axios from "axios";

const WebsocketComp = (props) => {
  const socket = io(`${consts.WS_URL}`);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isIssued, setIsIssued] = useState(false);

  const issueCredential = (gatacaSession, userData, issueTemplate) => {
    let postData = userData;
    if (userData.profile) {
      postData = {
        communityUserIdentifier: userData.profile.preferred_username,
        displayName: userData.displayName,
        givenName: userData.profile.given_name,
        familyName: userData.profile.family_name,
        emailAddress: userData.profile.email,
        schacHomeOrganization:userData.profile.schacHomeOrganization,
      };
    }

    let options = {
      method: "POST",
      //TODO fix this hard coded url
      url: consts.WS_API+"/issue",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        gatacaSession: gatacaSession,
        userData: postData,
        issueTemplate: issueTemplate,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("message", {
        type: "start-session",
        id: props.sessionId,
        socketID: socket.id,
        credential: props.issueTemplate
      });
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("message", async (data) => {
      // console.log(data)
      if (data.status === "READY" && data.sessionId === props.sessionId) {
        console.log("my issuance is completed");
        props.onIssueFinished();
        issueCredential(
          props.sessionId,
          props.userData,
          props.issueTemplate
        );
      }
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  return <></>;
};

export default WebsocketComp;
