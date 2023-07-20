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

      var areaId = file.split('_')[0];
      var year = file.split('_')[1];
      var month = file.split('_')[2];
      var day = file.split('_')[3];
      var solarIrradiation = file.split('_')[4];
      var decimalPart = file.split('_')[5];

      var date = new Date(year, month - 1, day);

      solarIrradiation = solarIrradiation + '.' + decimalPart;
      solarIrradiation = parseFloat(solarIrradiation);
      solarIrradiation = solarIrradiation / (24 * 60 * 60);

      const tiffFilePath = path.join(trainingDataFolder, file);
      const tiffBuffer = fs.readFileSync(tiffFilePath);
      const base64Tiff = tiffBuffer.toString('base64');

      // Add data as a JSON object to the allData array
      var data = {
        "areaId": areaId,
        "date": date,
        "solarIrradiation": solarIrradiation,
        "image": base64Tiff
      };

      allData.push(data);
    }
  });

  console.log('allData', allData[0]);

  // add data to database using express api
  const dotenv = require('dotenv');
  dotenv.config();

  const express = require('express');
  const app = express();
  const port = 3000;
  const sql = require('mssql');

  const dbConfig = {
    server: process.env.AZURE_SQL_SERVER,
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    database: process.env.AZURE_SQL_DB,
    options: {
      encrypt: true,
    }
  };

  // Connect to the database
  sql.connect(dbConfig)
    .then(() => {
      console.log('Connected to the database');

      // Sequentially insert data into the database
      (async function insertDataSequentially() {
        const request = new sql.Request();

        for (let i = 0; i < allData.length; i++) {
          const { areaId, date, solarIrradiation, image } = allData[i];

          const sqlQuery = `INSERT INTO trainingData (areaId, date, solarIrradiation, image) VALUES ('${areaId}', '${date.toISOString()}', '${solarIrradiation}', '${image}')`;

          try {
            await request.query(sqlQuery);
            console.log('(' + i + ') Data inserted successfully');
          } catch (err) {
            console.error('(' + i + ') Error inserting data:', err);
          }
        }
      })();

    })
    .catch((err) => {
      console.error('Error connecting to the database:', err);
    });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
