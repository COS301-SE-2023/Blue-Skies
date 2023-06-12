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

}
