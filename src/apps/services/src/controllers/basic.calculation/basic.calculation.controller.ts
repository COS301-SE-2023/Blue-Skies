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

}
