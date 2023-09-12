const Redis = require("redis");
const constants = require("../utils/consts")

let _client = null;

const DEFAULT_EXPIRATION = 300;

function getClient() {
  if (_client === null) {
    let redisUrl = constants.REDIS
    _client = Redis.createClient(6379, redisUrl); // this can take config stuff
  }
  return _client;
}

const setOrUpdateSessionData = async (
  sessionId,
  variableName,
  variableValue
) => {
  let client = getClient();
  let cacheObject = {
    [variableName]: variableValue,
  };
  // console.log("object to cache with key sessionId " + sessionId + "-variable name-"+ variableName);
  // console.log(cacheObject);
  //frist make sure object doesnot exist
  //if it exists get it and update if necessary its keys
  let existingObject = JSON.parse(await getSessionData(sessionId));
  // console.log("redis.js:: existing object");
  // console.log(existingObject);
  if (existingObject) {
    existingObject[variableName] = variableValue;
    // console.log("redis.js:: will update cache with " )
    // console.log(existingObject)
    await client.setex(sessionId, DEFAULT_EXPIRATION, JSON.stringify(existingObject));
  } else {
    await client.setex(sessionId, DEFAULT_EXPIRATION, JSON.stringify(cacheObject));
  }
};

const getSessionData = async (sessionId, variableName=null) => {
  return new Promise((resolve, reject) => {
    let client = getClient();
    client.get(sessionId, (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        if (variableName !== null) {
          try {
            let valueAsObject = JSON.parse(data);
            if(valueAsObject == null) resolve(null)
            else resolve(valueAsObject[variableName]);
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(data);
        }
      }
    });
  });
};

export { getSessionData, setOrUpdateSessionData };
