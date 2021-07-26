const http = require("http");

const Noble = require("noble");

const BeaconScanner = require("node-beacon-scanner");

// const SerialPort = require('serialport')



var scanner = new BeaconScanner();



var MacAddr;
// console.log("SERVER:"+process.env.SERVER_ADDRESS)
MacAddr = 'BRBELTEST'


const options = {
  hostname: 'rtlsdatabase',

  port: '3014',

  path: "/submit",

  method: "POST",

  headers: {
    "Content-Type": "application/json"

    //'Content-Length': data.length
  }
};

const options2 = {
    hostname: 'rtlsdatabase',

    port: '3014',

  path: "/mayday",

  method: "POST",

  headers: {
    "Content-Type": "application/json"

    //'Content-Length': data.length
  }
};


// var myVar = setInterval(myTimer, 5000);

function myTimer() {
  
  var d = new Date();
  
  const req = http.request(options2, res => {
    

      res.on("data", d => {
        process.stdout.write(d)
      });
  });

  req.on("error", error => {
    console.error("Mayday HTTP Request Error: " + error);
  });
  
  var mtst = Date.now();
  var jsondata = {};
  jsondata['hostname'] = MacAddr;
  jsondata['last_update'] = mtst/1000;
  req.write(JSON.stringify(jsondata));
  req.end();
  
}


scanner.onadvertisement = ad => {
  if (ad.beaconType == "eddystoneTlm") {
    ad.localName = MacAddr;
    data = JSON.stringify(ad);

    console.log(data);

    // const req = http.request(options, res => {
 
    //     res.on("data", d => {
    //       process.stdout.write(d)
    //     });
    // });

    // req.on("error", error => {
    //   console.error("Advertising HTTP Request Error: " + error);
    // });
	
    // req.write(data);
    // console.log(data);
    // req.end();
  }
};


// switch("DONGLE") {
//   case "ONBOARD":


	scanner.startScan().then(() => {
	    console.log("Scanning for BLE devices...");
	    console.log('Started to scan.');
	  })
	  .catch(error => {
	    console.error("Scan Init Error:" + error);
	});
	

//     break;
  
//   case "DONGLE":
    
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
		
// 		parser.on('data', console.log)
	
// 	});


//     break;
  
//   default:
//     console.log("Unrecognized scanMode:" + process.env.SCANMODE);
// }
