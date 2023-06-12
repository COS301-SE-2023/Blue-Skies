import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IKey from '../../models/key.interface';
import { connection as conn } from '../../main';
export default class KeyController {
  public createKey = (req: Request, res: Response) => {
    try {
      const { owner, APIKey, remainingCalls } = req.body;
      const query =
        `INSERT INTO [dbo].[keys] (owner, APIKey, remainingCalls)` +
        ` VALUES ('${owner}', '${APIKey}', ${remainingCalls})`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            return res.status(200).json({
              message: 'Key created successfully.',
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

  public getAllKeys = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[keys]';
      const keys: IKey[] = [];

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
        const key: IKey = {
          keyId: columns[0].value,
          owner: columns[1].value,
          APIKey: columns[2].value,
          remainingCalls: columns[3].value,
        };

        keys.push(key);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ keys: keys });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve keys.',
        details: 'Database connection error.',
      });
    }
  };

  public getKey = (req: Request, res: Response) => {
    const { keyId } = req.params;

    if (!Number.isInteger(Number(keyId))) {
      return res.status(400).json({
        error: 'Invalid keyId',
        details: 'keyId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[keys] WHERE keyId = ${keyId}`;

    const request = new tedious.Request(
      query,
      (err: tedious.RequestError, rowCount: number) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        } else if (rowCount === 0) {
          return res.status(401).json({
            error: 'Unauthorized',
            details: 'Key does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const key: IKey = {
        keyId: columns[0].value,
        owner: columns[1].value,
        APIKey: columns[2].value,
        remainingCalls: columns[3].value,
      };
      res.send(key);
    });

    conn.execSql(request);
  };

  public updateKey = (req: Request, res: Response) => {
    const { keyId } = req.params;

    if (!Number.isInteger(Number(keyId))) {
      return res.status(400).json({
        error: 'Invalid keyId',
        details: 'keyId must be an integer.',
      });
    }

    const { owner, APIKey, remainingCalls } = req.body;
    try {
      const query =
        `UPDATE [dbo].[keys] SET owner = '${owner}', APIKey = '${APIKey}', remainingCalls = ${remainingCalls}` +
        `WHERE keyId = ${keyId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(401).json({
              error: 'Unauthorized',
              details: 'Key does not exist.',
            });
          } else {
            request.on('requestCompleted', () => {
              res.status(200).json({
                message: 'Key updated successfully.',
              });
            });
          }
        }
      );
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update key.',
        details: 'Database connection error.',
      });
    }
  };

}
