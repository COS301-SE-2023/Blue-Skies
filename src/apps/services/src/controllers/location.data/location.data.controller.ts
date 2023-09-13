import { Request, Response } from 'express';
import { connection as conn } from '../../main';
import * as tedious from 'tedious';
import ILocationData from '../../models/location.data.interface';
export default class LocationDataController {
  public getMapBoxApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.MAP_BOX_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public getGoogleApiKey = async (req: Request, res: Response) => {
    try {
      const key: string = process.env.GOOGLE_API_KEY;
      res.status(200).json(key);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  //createSolarIrradiation
  public createLocationData = async (req: Request, res: Response) => {
    const {
      latitude,
      longitude,
      locationName,
      solarPanelsData,
      satteliteImageData,
      satteliteImageElevationData,
      annualFluxData,
      monthlyFluxData,
      maskData,
      daylightHours,
      horisonElevationData,
    } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const dlh = parseFloat(daylightHours.replace(',', '.'));
    const satteliteImageDataByteArray: Uint8Array = new Uint8Array(
      satteliteImageData
    );
    const satteliteImageElevationDataByteArray: Uint8Array = new Uint8Array(
      satteliteImageElevationData
    );
    const annualFluxDataByteArray: Uint8Array = new Uint8Array(annualFluxData);
    const monthlyFluxDataByteArray: Uint8Array = new Uint8Array(
      monthlyFluxData
    );
    const maskDataByteArray: Uint8Array = new Uint8Array(maskData);
    const query = `INSERT INTO [dbo].[locationData] (latitude, longitude, locationName, solarPanelsData, satteliteImageData, satteliteImageElevationData, annualFluxData, monthlyFluxData, maskData, dateCreated, daylightHours, horisonElevationData) VALUES (${lat}, ${long}, '${locationName}', '${solarPanelsData}', @satteliteImageData, @satteliteImageElevationData, @annualFluxData, @monthlyFluxData, @maskData, '${dateCreated}', ${dlh}, '${horisonElevationData}')`;
    // const query = `INSERT INTO [dbo].[locationData] (latitude, longitude, locationName, solarPanelsData, satteliteImageData, satteliteImageElevationData, annualFluxData, maskData, dateCreated, daylightHours, horisonElevationData) VALUES (${lat}, ${long}, '${locationName}', '${solarPanelsData}', ${satteliteImageData}, ${satteliteImageElevationData}, ${annualFluxData}, ${maskData}, '${dateCreated}', ${dlh}, '${horisonElevationData}')`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('An error occured');
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Solar Irradiation created successfully.',
            });
          }
        }
      );
      request.addParameter(
        'satteliteImageData',
        tedious.TYPES.VarBinary,
        Buffer.from(satteliteImageDataByteArray)
      );
      request.addParameter(
        'satteliteImageElevationData',
        tedious.TYPES.VarBinary,
        Buffer.from(satteliteImageElevationDataByteArray)
      );
      request.addParameter(
        'annualFluxData',
        tedious.TYPES.VarBinary,
        Buffer.from(annualFluxDataByteArray)
      );
      request.addParameter(
        'monthlyFluxData',
        tedious.TYPES.VarBinary,
        Buffer.from(monthlyFluxDataByteArray)
      );
      request.addParameter(
        'maskData',
        tedious.TYPES.VarBinary,
        Buffer.from(maskDataByteArray)
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //get solarIrradiation
  public getLocationData = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `SELECT * FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;
    let solarIrradiation: ILocationData;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            res.status(200).json(solarIrradiation);
          }
        }
      );

      request.on('row', (columns) => {
        const satteliteImageDataByteArray = columns[4].value as Buffer;
        const satteliteImageElevationDataByteArray = columns[5].value as Buffer;
        const annualFluxDataByteArray = columns[6].value as Buffer;
        const monthlyFluxDataByteArray = columns[7].value as Buffer;
        const maskDataByteArray = columns[8].value as Buffer;

        solarIrradiation = {
          latitude: columns[0].value,
          longitude: columns[1].value,
          locationName: columns[2].value,
          solarPanelsData: columns[3].value,
          satteliteImageData: Array.from(satteliteImageDataByteArray),
          satteliteImageElevationData: Array.from(
            satteliteImageElevationDataByteArray
          ),
          annualFluxData: Array.from(annualFluxDataByteArray),
          monthlyFluxData: Array.from(monthlyFluxDataByteArray),
          maskData: Array.from(maskDataByteArray),
          dateCreated: columns[9].value,
          daylightHours: columns[10].value,
          horisonElevationData: columns[11].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //delete solarIrradiation
  public deleteLocationData = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.params;
    const lat = parseFloat(latitude.replace(',', '.'));
    const long = parseFloat(longitude.replace(',', '.'));
    const query = `DELETE FROM [dbo].[locationData] WHERE latitude = ${lat} AND longitude = ${long}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            res.status(404).json({
              message: 'Solar Irradiation not found.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Solar Irradiation deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
