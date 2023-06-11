import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IAppliance from '../../models/appliance.interface';
import { connection as conn } from '../../main';
export default class ApplianceController {
  public createAppliance = (req: Request, res: Response) => {
    try {
      const { type, powerUsage } = req.body;
      const query =
        `INSERT INTO [dbo].[appliances] (type, powerUsage)` +
        ` VALUES ('${type}', ${powerUsage})`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            return res.status(200).json({
              message: 'Appliance created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  };

  public getAllAppliances = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[appliances]';
      const appliances: IAppliance[] = [];

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const appliance: IAppliance = {
          applianceId: columns[0].value,
          type: columns[1].value,
          powerUsage: columns[2].value,
        };

        appliances.push(appliance);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ appliances: appliances });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve appliances.',
        details: 'Database connection error.',
      });
    }
  };
}
