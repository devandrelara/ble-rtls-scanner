const BeaconScanner = require("node-beacon-scanner");


var scanner = new BeaconScanner();

scanner.onadvertisement = ad => {
  data = JSON.stringify(ad);
  console.log(ad)
  
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
