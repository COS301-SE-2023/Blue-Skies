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

  //   Get all Custom Appliances

  public getAllCustomAppliances(req: Request, res: Response) {
    try {
      const query = `SELECT * FROM [dbo].[customAppliances]`;
      const customAppliances: ICustomAppliance[] = [];
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number, rows: any) => {
          if (err) {
            console.log('Express: ' + err.message);
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log('Express: Custom appliances retrieved successfully.');
            res.status(200).json(customAppliances);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const customAppliance: ICustomAppliance = {
          customApplianceId: columns[0].value,
          type: columns[1].value,
          model: columns[2].value,
          powerUsage: columns[3].value,
        };
        customAppliances.push(customAppliance);
      });

      //   Execute SQL statement
      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  //   Delete a custom appliance

  public deleteCustomAppliance(req: Request, res: Response) {
    try {
      const { customApplianceId } = req.params;
      const query = `DELETE FROM [dbo].[customAppliances] WHERE customApplianceId = ${customApplianceId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            res.status(400).json({
              error: err.message,
            });
          } else {
            console.log('Express: Custom appliance deleted successfully.');
            res.status(200).json({
              message: 'Custom appliance deleted successfully.',
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
