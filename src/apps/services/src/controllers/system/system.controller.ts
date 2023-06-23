import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ISystem from '../../models/system.interface';
import { connection as conn } from '../../main';
export default class SystemController {
  public createSystem = (req: Request, res: Response) => {
    const {
      inverterOutput,
      numberOfPanels,
      batterySize,
      numberOfBatteries,
      solarInput,
    } = req.body;
    const query =
      `INSERT INTO [dbo].[systems] (inverterOutput, numberOfPanels, batterySize, numberOfBatteries, solarInput)` +
      ` VALUES ('${inverterOutput}', '${numberOfPanels}', '${batterySize}', '${numberOfBatteries}', '${solarInput}')`;

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
              message: 'System created successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAllSystems = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[systems]';
    const systems: ISystem[] = [];

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if(rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'No systems exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(systems);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const system: ISystem = {
          systemId: columns[0].value,
          inverterOutput: columns[1].value,
          numberOfPanels: columns[2].value,
          batterySize: columns[3].value,
          numberOfBatteries: columns[4].value,
          solarInput: columns[5].value,
        };

        systems.push(system);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getSystem = (req: Request, res: Response) => {
    const { systemId } = req.params;
    let system: ISystem;
    const query = `SELECT * FROM [dbo].[systems] WHERE systemId = ${systemId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(404).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'User does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(system);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        system = {
          systemId: columns[0].value,
          inverterOutput: columns[1].value,
          numberOfPanels: columns[2].value,
          batterySize: columns[3].value,
          numberOfBatteries: columns[4].value,
          solarInput: columns[5].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateSystem = (req: Request, res: Response) => {
    const { systemId } = req.params;

    if (!Number.isInteger(Number(systemId))) {
      return res.status(400).json({
        error: 'Invalid systemId',
        details: 'systemId must be an integer.',
      });
    }

    const {
      inverterOutput,
      numberOfPanels,
      batterySize,
      numberOfBatteries,
      solarInput,
    } = req.body;
    try {
      const query =
        `UPDATE [dbo].[systems] SET inverterOutput = '${inverterOutput}', numberOfPanels = '${numberOfPanels}',` +
        ` batterySize = ${batterySize}, numberOfBatteries = ${numberOfBatteries}, solarInput = ${solarInput} WHERE systemId = ${systemId}`;
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
              details: 'User does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );
      conn.execSql(request);
      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'System updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update system.',
        details: 'Database connection error.',
      });
    }
  };

  deleteSystem = async (req: Request, res: Response) => {
    const { systemId } = req.params;

    if (!Number.isInteger(Number(systemId))) {
      return res.status(400).json({
        error: 'Invalid systemId',
        details: 'systemId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[systems] WHERE systemId = ${systemId}`;
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
              details: 'User does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'System deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find system to delete.',
        details: 'Database connection error.',
      });
    }
  };
}
