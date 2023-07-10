const fs = require('fs');
const path = require('path');

const twoLevelsUpFolder = path.join(__dirname, '..', '..', '..', '..', '..');

const trainingDataFolder = path.join(twoLevelsUpFolder, 'Training_Data');

fs.readdir(trainingDataFolder, (err, files) => {
  if (err) {
    console.log('Error reading Training_Data folder:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.tif')) {
        // Example: 02496287_2020_01_04_21474836_47.tif

        var areaCode = file.split('_')[0];
        var year = file.split('_')[1];
        var month = file.split('_')[2];
        var day = file.split('_')[3];
        var solarRadiation = file.split('_')[4];
        var decimalPart = file.split('_')[5];

        solarRadiation = solarRadiation + '.' + decimalPart;
        solarRadiation = parseFloat(solarRadiation);
        solarRadiation = solarRadiation / (24 * 60 * 60);

        console.log('areaCode', areaCode);
        console.log('year', year);
        console.log('month', month);
        console.log('day', day);
        console.log('solarRadiation', solarRadiation);
    }
  });
});
