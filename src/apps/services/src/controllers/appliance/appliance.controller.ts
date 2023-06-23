import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IAppliance from '../../models/appliance.interface';
import { connection as conn } from '../../main';
export default class ApplianceController {
  public createAppliance = (req: Request, res: Response) => {
    const { type, powerUsage } = req.body;
    const query =
      `INSERT INTO [dbo].[appliances] (type, powerUsage)` +
      ` VALUES ('${type}', ${powerUsage})`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
            return res.status(200).json({
              message: 'Appliance created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve appliances.',
        details: 'Database connection error.',
      });
    }
  };

  public getAllAppliances = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[appliances]';
    const appliances: IAppliance[] = [];

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'No appliances exist.',
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
        res.json(appliances);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve appliances.',
        details: 'Database connection error.',
      });
    }
  };

  public getAppliance = (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const query = `SELECT * FROM [dbo].[appliances] WHERE applianceId = ${applianceId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Appliance does not exist.',
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
        res.send(appliance);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve appliances.',
        details: 'Database connection error.',
      });
    }
  };

  public updateAppliance = (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const { type, powerUsage } = req.body;
    const query =
      `UPDATE [dbo].[appliances] SET type = '${type}', powerUsage = ${powerUsage}` +
      `WHERE applianceId = ${applianceId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Appliance updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update appliance.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteAppliance = async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const query = `DELETE FROM [dbo].[appliances] WHERE applianceId = ${applianceId}`;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Appliance deleted successfully.',
            });
          }
        }
      );
      
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find appliance to delete.',
        details: 'Database connection error.',
      });
    }
  };
}
