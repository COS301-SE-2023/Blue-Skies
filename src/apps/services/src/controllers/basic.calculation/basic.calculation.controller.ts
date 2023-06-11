import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IBasicCalculation from '../../models/basic.calculation.interface';
import { connection as conn } from '../../main';
export default class BasicCalculationController {
  public createBasicCalculation = (req: Request, res: Response) => {
    try {
      const { systemId, dayLightHours, location, batteryLife } = req.body;

      const dateCreated = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      const query =
        `INSERT INTO [dbo].[basicCalculations] (systemId, dayLightHours, location, batteryLife, dateCreated)` +
        ` VALUES ('${systemId}', '${dayLightHours}', '${location}', '${batteryLife}', '${dateCreated}')`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(404).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
              message: 'Basic calculation created successfully.',
            });
          }
        }
      );
      conn.execSql(request);
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
  };

  public getAllBasicCalculations = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[basicCalculations]';
      const basicCalculations: IBasicCalculation[] = [];

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(404).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            return request.on('requestCompleted', () => {
              res.status(200);
              res.json({ basicCalculations: basicCalculations });
            });
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const basicCalculation: IBasicCalculation = {
          basicCalculationId: columns[0].value,
          systemId: columns[1].value,
          daylightHours: columns[2].value,
          location: columns[3].value,
          batteryLife: columns[4].value,
          dateCreated: columns[5].value,
        };

        basicCalculations.push(basicCalculation);
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve basic calculations.',
        details: 'Database connection error.',
      });
    }
  };

  public getBasicCalculation = (req: Request, res: Response) => {
    const { basicCalculationId } = req.params;

    if (!Number.isInteger(Number(basicCalculationId))) {
      return res.status(400).json({
        error: 'Invalid basicCalculationId',
        details: 'basicCalculationId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[basicCalculations] WHERE basicCalculationId = ${basicCalculationId}`;

    const request = new tedious.Request(
      query,
      (err: tedious.RequestError, rowCount: number) => {
        if (err) {
          return res.status(404).json({
            error: err.message,
          });
        } else if (rowCount === 0) {
          return res.status(401).json({
            error: 'Unauthorized',
            details: 'Basic calculation does not exist.',
          });
        } else {
          console.log(rowCount);
          request.on('requestCompleted', () => {
            res.status(200);
          });
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const basicCalculation: IBasicCalculation = {
        basicCalculationId: columns[0].value,
        systemId: columns[1].value,
        daylightHours: columns[2].value,
        location: columns[3].value,
        batteryLife: columns[4].value,
        dateCreated: columns[5].value,
      };

      res.send(basicCalculation);
    });

    conn.execSql(request);
  };

 
}
