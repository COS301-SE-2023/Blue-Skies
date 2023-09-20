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
      `INSERT INTO [dbo].[systems] (systemSize, inverterOutput, numberOfPanels, batterySize, numberOfBatteries, solarInput)` +
      `OUTPUT Inserted.systemId` +
      ` VALUES ('custom','${inverterOutput}', '${numberOfPanels}', '${batterySize}', '${numberOfBatteries}', '${solarInput}')`;
    let systemId: number;
    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log('Express: System created successfully.');
            return res.status(200).json({
              message: 'System created successfully.',
              systemId: systemId,
            });
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        systemId = columns[0].value;
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
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
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: No systems exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'No systems exist.',
            });
          } else {
            console.log('Express: systems retrieved successfully.');
            res.status(200).json(systems);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const system: ISystem = {
          systemId: columns[0].value,
          systemSize: columns[1].value,
          inverterOutput: columns[2].value,
          numberOfPanels: columns[3].value,
          batterySize: columns[4].value,
          numberOfBatteries: columns[5].value,
          solarInput: columns[6].value,
        };

        systems.push(system);
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
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
            console.log('Express: ' + err.message);
            return res.status(404).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: System does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'System does not exist.',
            });
          } else {
            console.log('Express: System retrieved successfully.');
            res.status(200).json(system);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        system = {
          systemId: columns[0].value,
          systemSize: columns[1].value,
          inverterOutput: columns[2].value,
          numberOfPanels: columns[3].value,
          batterySize: columns[4].value,
          numberOfBatteries: columns[5].value,
          solarInput: columns[6].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateSystem = (req: Request, res: Response) => {
    const { systemId } = req.params;
    const {
      inverterOutput,
      numberOfPanels,
      batterySize,
      numberOfBatteries,
      solarInput,
    } = req.body;
    const query =
      `UPDATE [dbo].[systems] SET inverterOutput = '${inverterOutput}', numberOfPanels = '${numberOfPanels}',` +
      ` batterySize = ${batterySize}, numberOfBatteries = ${numberOfBatteries}, solarInput = ${solarInput} WHERE systemId = ${systemId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(404).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: System does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'System does not exist.',
            });
          } else {
            console.log('Express: System updated successfully.');
            res.status(200).json({
              message: 'System updated successfully.',
            });
          }
        }
      );
      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteSystem = async (req: Request, res: Response) => {
    const { systemId } = req.params;
    const query = `DELETE FROM [dbo].[systems] WHERE systemId = ${systemId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log('Express: ' + err.message);
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            console.log('Express: System does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'System does not exist.',
            });
          } else {
            console.log('Express: System deleted successfully.');
            res.status(200).json({
              message: 'System deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
