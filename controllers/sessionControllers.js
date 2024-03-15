import { getSessionData, setOrUpdateSessionData } from "../services/redis";
import { endpoints } from "../config/seal_endpoints";
import { v4 as uuidv4 } from "uuid";

const startSession = async (app, req, res, endpoint) => {
  let newSessionId = uuidv4();

  try {
    let response = await setOrUpdateSessionData(
      newSessionId,
      endpoints.sealSMUri,
      endpoints.sealSMPort
    );
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};
