let appToken = "";
let sessionToken = "";

//Change this variables with your installation
const group = "MyAcademicID_Verification";
const tenant = "*****";
const appName = "7a8aeabb-1392-475c-9d14-e04694923d16";
const appPassword = "AyDYNmo1Xq9Qou9ruFYSH7pP2jnp17ohRP8adM4jwihG";
const connectServer = "https://connect.gataca.io";
const nucleusServer = "https://nucleus.gataca.io";

const getAppToken = async () => {
  if (!appToken) {
    let response = await fetch(
      nucleusServer + "/admin/v1/api_keys/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(appName + ":" + appPassword),
          //'tenant': tenant,
          'ssiconfig': group
        },
        body: "{}"
      })
    appToken = response.headers.get('Token')

    return appToken
  }

  return appToken
}
getAppToken().then(res =>{console.log(res)})
