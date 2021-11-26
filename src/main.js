const http = require("http");

const Noble = require("noble");

const BeaconScanner = require("node-beacon-scanner");
var os = require("os");

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var scanner = new BeaconScanner();

var hostname = os.hostname();
var mqtt = require('mqtt')

var mqttBroker = process.env.MQTT_BROKER
var mqttPort = process.env.MQTT_PORT
var topicMqtt = process.env.MQTT_TOPIC
var clientIdMqtt = makeid(12)

var client  = mqtt.connect({hostname: mqttBroker, port: mqttPort, clientId: clientIdMqtt})
var payloadMQTT;
scanner.onadvertisement = ad => {
  if (ad.beaconType == "eddystoneTlm") {
    ad.localName = hostname;
    data = JSON.stringify(ad);
    timeNow = Date.now()
    payloadMQTT = `IdGateway=${hostname}&MacBeacon=${ad.address}&RSSI=${ad.rssi}&TimeMillisGatewayReading=${timeNow}&Mode=Onboard`
    console.log("onboard:")
    console.log(payloadMQTT);

    client.publish(topicMqtt, payloadMQTT)
  }
};

var scanmode = process.env.SCAN_MODE
console.log(scanmode)

try {
  try {
    

    	var port = new SerialPort("/dev/ttyACM0", {
	    baudRate: 115200,
	    parity: 'none',
	    stopBits: 1,
	    dataBits: 8,
	    flowControl: false
	});
	
	
	port.on("open", function () {
	    console.log('Serial port opened');
		const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
		parser.on('data', (d)=>{
            console.log("Dongle:" + d)
            jsa = JSON.parse(d)
            timeNow = Date.now()
            payloadMQTT = `IdGateway=${hostname}&MacBeacon=${jsa.Device}&RSSI=${jsa.RSSI}&TimeMillisGatewayReading=${timeNow}&Mode=Dongle`
            client.publish(topicMqtt, payloadMQTT)
        })
	
	});
  throw new Error("Não abriu porta serial");

  }
  catch (ex) {

	scanner.startScan().then(() => {
	    console.log("Scanning for BLE devices...");
	    console.log('Started to scan.');
	  })
	  .catch(error => {
	    console.error("Scan Init Error:" + error);
	});

    console.error("inner", ex.message);
  }
  finally {
    console.log("finally");
  }
}
catch (ex) {

  console.error("nao deu pra fazer nem um nem outro", ex.message);
}

// switch(scanmode) {
//   case "onboard":

// 	scanner.startScan().then(() => {
// 	    console.log("Scanning for BLE devices...");
// 	    console.log('Started to scan.');
// 	  })
// 	  .catch(error => {
// 	    console.error("Scan Init Error:" + error);
// 	});
	

//     break;
  
//   case "dongle":
    
// 	var port = new SerialPort("/dev/ttyACM0", {
// 	    baudRate: 115200,
// 	    parity: 'none',
// 	    stopBits: 1,
// 	    dataBits: 8,
// 	    flowControl: false
// 	});
	
	
// 	port.on("open", function () {
// 	    console.log('Serial port opened');
// 		const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
// 		parser.on('data', (d)=>{
//             console.log("Dongle:" + d)
//             jsa = JSON.parse(d)
//             timeNow = Date.now()
//             payloadMQTT = `IdGateway=${hostname}&MacBeacon=${jsa.Device}&RSSI=${jsa.RSSI}&TimeMillisGatewayReading=${timeNow}`
//             client.publish(topicMqtt, payloadMQTT)
//         })
	
// 	});

//     break;
  
//   default:
//     console.log("Unrecognized scanMode:" + scanmode);
// }

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
