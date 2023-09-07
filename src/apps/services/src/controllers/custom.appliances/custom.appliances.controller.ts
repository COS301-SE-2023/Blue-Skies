import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ICustomAppliance from '../../models/custom.appliance.interface';
import { connection as conn } from '../../main';
export default class CustomAppliancesController {
  // create a new custom appliance
  public createCustomAppliance(req: Request, res: Response) {
    try {
      const { type, model, powerUsage } = req.body;
      const query =
        `INSERT INTO [dbo].[customAppliances] (type, model, powerUsage)` +
        ` VALUES ('${type}', '${model}', ${powerUsage})`;

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log('Express: Custom appliance created successfully.');
            res.status(200).json({
              message: 'Custom appliance created successfully.',
            });
          }
        }
      );

      //   Execute SQL statement
      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }
}
