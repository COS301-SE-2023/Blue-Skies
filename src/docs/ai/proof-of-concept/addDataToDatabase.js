console.log('starting...');
const fs = require('fs');
const path = require('path');

const twoLevelsUpFolder = path.join(__dirname, '..', '..', '..', '..', '..');

const trainingDataFolder = path.join(twoLevelsUpFolder, 'Training_Data');

var allData = [];

fs.readdir(trainingDataFolder, (err, files) => {
  if (err) {
    console.log('Error reading Training_Data folder:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.tif')) {
        // Example: 02496287_2020_01_04_2147483647.tif

        var areaCode = file.split('_')[0];
        var year = file.split('_')[1];
        var month = file.split('_')[2];
        var day = file.split('_')[3];
        var solarRadiation = file.split('_')[4];
        var decimalPart = file.split('_')[5];

        var date = new Date(year, month - 1, day);

        solarRadiation = solarRadiation + '.' + decimalPart;
        solarRadiation = parseFloat(solarRadiation);
        solarRadiation = solarRadiation / (24 * 60 * 60);

        //Add data as a json object to the allData
        var data = {
          "areaCode": areaCode,
          "date": date,
          "solarRadiation": solarRadiation,
          "image": fs.readFileSync(path.join(trainingDataFolder, file), { encoding: 'base64' })
        };
        
        allData.push(data);
              
    }
   
  });
  console.log('allData', allData[0]);
});

