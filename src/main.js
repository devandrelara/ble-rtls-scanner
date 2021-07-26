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
var userMqtt = process.env.MQTT_USER
var passMqtt = process.env.MQTT_PASS
var topicMqtt = process.env.MQTT_TOPIC

// var mqttBroker = "10.57.16.20"
// var mqttPort = "1883"
// var userMqtt = process.env.MQTT_USER
// var passMqtt = process.env.MQTT_PASS
// var topicMqtt = "rtls/blescan"
var client  = mqtt.connect({hostname: mqttBroker, port: mqttPort, clientId:'watcherRTLS'})

scanner.onadvertisement = ad => {
  if (ad.beaconType == "eddystoneTlm") {
    ad.localName = hostname;
    data = JSON.stringify(ad);
    var payloadMQTT = `Gateway=${hostname}&Beacon=${ad.address}&RSSI=${ad.rssi}`
    console.log(payloadMQTT);

    client.publish(topicMqtt, payloadMQTT)
  }
};

var scanmode = 'dongle'
switch(scanmode) {
  case "onboard":

	scanner.startScan().then(() => {
	    console.log("Scanning for BLE devices...");
	    console.log('Started to scan.');
	  })
	  .catch(error => {
	    console.error("Scan Init Error:" + error);
	});
	

    break;
  
  case "dongle":
    
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
            console.log("Data:" + d)
            jsa = JSON.parse(d)
            console.log(jsa.Device);
            console.log(jsa.RSSI);
        })
	
	});

    break;
  
  default:
    console.log("Unrecognized scanMode:" + scanmode);
}
