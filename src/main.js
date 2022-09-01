const BeaconScanner = require("node-beacon-scanner");
var os = require("os");
var mqtt = require('mqtt')
var scanner = new BeaconScanner();

var mqttBroker = process.env.MQTT_BROKER
var mqttPort = process.env.MQTT_PORT
var topicMqtt = process.env.MQTT_TOPIC
var clientIdMqtt = makeid(12)

var client  = mqtt.connect({hostname: mqttBroker, port: mqttPort, clientId: clientIdMqtt})

var hostname = os.hostname();
var payloadMQTT;
var startime = Date.now()
scanner.onadvertisement = ad => {
  ad.localName = hostname;
  data = JSON.stringify(ad);
  timeNow = Date.now()
  payloadMQTT = `IdGateway=${hostname}&MacBeacon=${ad.address}&RSSI=${ad.rssi}&Time=${timeNow}`
  
  console.log(payloadMQTT);
  console.log((timeNow-startime)/1000)
  client.publish(topicMqtt, payloadMQTT)
};

scanner.startScan().then(() => {
    console.log("Scanning for BLE devices...");
    console.log('Started to scan.');
  })
  .catch(error => {console.error("Scan Init Error:" + error);
});

  
 



function makeid(length) {
    var result           = [];
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   
   return result.join('').toLocaleLowerCase();
}
