import { useEffect, useState } from "react";
import io from "socket.io-client";
import React from "react";
import consts from "../../utils/consts";

const WebsocketComp = (props) => {
  const socket = io(`${consts.WS_URL}`);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isIssued, setIsIssued] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      
      setIsConnected(true);
      socket.emit('message', {
        type: "start-session",
        id: props.sessionId,
        socketID: socket.id,
      });
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("message", (data) => {
      // console.log(data)
      if(data.status === "READY" && data.sessionId=== props.sessionId){
        console.log("my issuance is completed")
        props.onIssueFinished()
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
