const rp = require('request-promise').defaults({jar: true})
const config = require("config")
let honeyUN = config.get("honeywell.user");
let honeyPW = config.get("honeywell.password");
let honeyDID = config.get("honeywell.did");

var hwLoginOptions = {
  method: 'POST',
  uri: 'https://mytotalconnectcomfort.com/portal/',
  followAllRedirects: true,
  form: {
    UserName: honeyUN,
    Password: honeyPW,
    timeOffset: 360
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0'
  }
}

var hwControlOptions = {
  method: 'POST',
  uri: 'https://mytotalconnectcomfort.com/portal/Device/SubmitControlScreenChanges',
  form: {
    // CoolNextPeriod: null,
    // CoolSetpoint: null,
    DeviceID: honeyDID,
    // FanMode: null,
    // HeatNextPeriod: null,
    // HeatSetpoint: 58,
    // StatusCool: 1,
    // StatusHeat: 1,
    // SystemSwitch: null
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

var hwQuery = {
    method: 'POST',
    uri: 'https://mytotalconnectcomfort.com/portal/Device/CheckDataSession/' + honeyDID,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
      'X-Requested-With': 'XMLHttpRequest'
    }
}

rp(hwLoginOptions)
  .then(function (hwReply) {
    console.log("Received login reply.")
    rp(hwQuery)
      .then(function (hwResponse) {
        console.log("Received second reply.")
        var myData = JSON.parse(hwResponse)
        console.log("Current temp: " + myData.latestData.uiData.DispTemperature)
        console.log("Current heat setpoing: " + myData.latestData.uiData.HeatSetpoint)
      })
      .catch(function (err) {
        console.log(err.error)
      })
  })
  .catch(function (err) {
    console.log(err.error)
  })
