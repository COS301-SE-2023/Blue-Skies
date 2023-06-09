import * as tedious from 'tedious';
import { Request, Response } from 'express';
import ISystem from '../../models/system.interface';
import { connection as conn } from '../../main';
export default class SystemController {
  public getAllSystems = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[systems]';
      const systems: ISystem[] = [];

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err);
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const user: ISystem = {
          systemId: columns[0].value,
          inverterOutput: columns[1].value,
          numberOfPanels: columns[2].value,
          batterySize: columns[3].value,
          numberOfBatteries: columns[4].value,
          solarInput: columns[5].value,
        };

        systems.push(user);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ systems: systems });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve systems.',
        details: 'Database connection error.',
      });
    }
  };
  public getSystem = (req: Request, res: Response) => {
    const { systemId } = req.params;
    const query = `SELECT * FROM [dbo].[systems] WHERE systemId = ${systemId}`;

    conn.on('connect', (err: tedious.ConnectionError) => {
      if (err) {
        console.log(err);
      } else {
        const request = new tedious.Request(
          query,
          (err: tedious.RequestError, rowCount: number) => {
            if (err) {
              console.log(err);
            } else {
              console.log(rowCount);
            }
          }
        );

        request.on('row', (columns: tedious.ColumnValue[]) => {
          const user: ISystem = {
            systemId: columns[0].value,
            inverterOutput: columns[1].value,
            numberOfPanels: columns[2].value,
            batterySize: columns[3].value,
            numberOfBatteries: columns[4].value,
            solarInput: columns[5].value,
          };

          res.send(user);
        });

        conn.execSql(request);
      }
    });
  };
}
