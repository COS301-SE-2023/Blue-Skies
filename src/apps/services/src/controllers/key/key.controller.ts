import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IKey from '../../models/key.interface';
import { connection as conn } from '../../main';
export default class KeyController {
  public createKey = (req: Request, res: Response) => {
    const { owner, APIKey, remainingCalls } = req.body;
    const query =
      `INSERT INTO [dbo].[keys] (owner, APIKey, remainingCalls)` +
      ` VALUES ('${owner}', '${APIKey}', ${remainingCalls})`;

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
            console.log('Express: Key created successfully.');
            return res.status(200).json({
              message: 'Key created successfully.',
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

  public createBusinessKey = (req: Request, res: Response) => {
    const {
      owner,
      APIKey,
      remainingCalls,
      description,
      location,
      website,
      phoneNumber,
      email,
    } = req.body;
    const query =
      `INSERT INTO [dbo].[keys] (owner, APIKey, remainingCalls, isBusiness, description, location, website, phoneNumber, email)` +
      ` VALUES ('${owner}', '${APIKey}', ${remainingCalls}, 1, '${description}', '${location}', '${website}', '${phoneNumber}', '${email}')`;

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
            console.log('Express: Key created successfully.');
            return res.status(200).json({
              message: 'Key created successfully.',
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

  public getAllKeys = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[keys]';
    const keys: IKey[] = [];

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
            console.log('Express: No keys exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'No keys exist.',
            });
          } else {
            console.log('Express: keys retrieved successfully.');
            res.status(200).json(keys);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const key: IKey = {
          keyId: columns[0].value,
          APIKey: columns[1].value,
          remainingCalls: columns[2].value,
          suspended: columns[3].value,
          owner: columns[4].value,
          isBusiness: columns[5].value,
          description: columns[6].value,
          location: columns[7].value,
          website: columns[8].value,
          phoneNumber: columns[9].value,
          email: columns[10].value,
        };
        keys.push(key);
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAllBusinessKeys = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[keys] WHERE isBusiness = 1';
    const keys: IKey[] = [];

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
            console.log('Express: No business keys exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'No business keys exist.',
            });
          } else {
            console.log('Express: business keys retrieved successfully.');
            res.status(200).json(keys);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const key: IKey = {
          keyId: columns[0].value,
          APIKey: columns[1].value,
          remainingCalls: columns[2].value,
          suspended: columns[3].value,
          owner: columns[4].value,
          isBusiness: columns[5].value,
          description: columns[6].value,
          location: columns[7].value,
          website: columns[8].value,
          phoneNumber: columns[9].value,
          email: columns[10].value,
        };
        keys.push(key);
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getKey = (req: Request, res: Response) => {
    const { keyId } = req.params;
    let key: IKey;
    const query = `SELECT * FROM [dbo].[keys] WHERE keyId = ${keyId}`;

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
            console.log('Express: Key does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Key does not exist.',
            });
          } else {
            console.log('Express: Key retrieved successfully.');
            res.status(200).json(key);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        key = {
          keyId: columns[0].value,
          APIKey: columns[1].value,
          remainingCalls: columns[2].value,
          suspended: columns[3].value,
          owner: columns[4].value,
          isBusiness: columns[5].value,
          description: columns[6].value,
          location: columns[7].value,
          website: columns[8].value,
          phoneNumber: columns[9].value,
          email: columns[10].value,
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

  public updateKey = (req: Request, res: Response) => {
    const { keyId } = req.params;
    const { owner, APIKey, remainingCalls, suspended } = req.body;
    const query =
      `UPDATE [dbo].[keys] SET owner = '${owner}', APIKey = '${APIKey}', remainingCalls = ${remainingCalls}, suspended = '${suspended}'` +
      ` WHERE keyId = ${keyId}`;
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
            console.log('Express: Key does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Key does not exist.',
            });
          } else {
            console.log('Express: Key updated successfully.');
            res.status(200).json({
              message: 'Key updated successfully.',
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

  public updateBusinessKey = (req: Request, res: Response) => {
    const { keyId } = req.params;
    const {
      owner,
      APIKey,
      remainingCalls,
      suspended,
      description,
      location,
      website,
      phoneNumber,
      email,
    } = req.body;
    const query =
      `UPDATE [dbo].[keys] SET owner = '${owner}', APIKey = '${APIKey}', remainingCalls = ${remainingCalls}, suspended = '${suspended}',` +
      ` description = '${description}', location = '${location}' , website = '${website}', phoneNumber = '${phoneNumber}', email = '${email}'` +
      ` WHERE keyId = ${keyId}`;
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
            console.log('Express: Key does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Key does not exist.',
            });
          } else {
            console.log('Express: Key updated successfully.');
            res.status(200).json({
              message: 'Key updated successfully.',
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

  public deleteKey = async (req: Request, res: Response) => {
    const { keyId } = req.params;
    const query = `DELETE FROM [dbo].[keys] WHERE keyId = ${keyId}`;

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
            console.log('Express: Key does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'Key does not exist.',
            });
          } else {
            console.log('Express: Key deleted successfully.');
            res.status(200).json({
              message: 'Key deleted successfully.',
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
