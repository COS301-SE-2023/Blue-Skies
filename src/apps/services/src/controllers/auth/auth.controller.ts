import { connection as conn } from '../../main';
import { Request, Response } from 'express';
import * as tedious from 'tedious';
import IUser from '../../models/user.interface';

export default class AuthController {
  public registerUser = (req: Request, res: Response) => {
    const { email, password, userRole } = req.body;
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `INSERT INTO [dbo].[users] (email, password, userRole, dateCreated, lastLoggedIn) VALUES ('${email}', '${password}', '${userRole}', '${dateCreated}', '${dateCreated}')`;

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
            console.log('Express: User registered successfully.');
            res.status(200).json({
              message: 'User registered successfully.',
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

  public loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;
    let user: IUser;
    const query = `SELECT * FROM [dbo].[users] WHERE CONVERT(VARCHAR, email) = '${email}'`;

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
            console.log('Express: User does not exist.');
            res.status(404).json({
              error: 'Invalid email',
              details: 'User does not exist.',
            });
          } else {
            if (user.password === password) {
              console.log('Express: User logged in successfully.');
              res.status(200).json(user);
            } else {
              console.log('Express: Password is incorrect.');
              res.status(401).json({
                error: 'Unauthorized',
                details: 'Password is incorrect.',
              });
            }
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        user = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          dateCreated: columns[4].value,
          lastLoggedIn: columns[5].value,
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

  public checkEmail = (req: Request, res: Response) => {
    const { email } = req.body;
    const query = `SELECT * FROM [dbo].[users] WHERE CONVERT(VARCHAR, email) = '${email}'`;

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
            console.log('Express: Email is available.');
            res.status(200).json({
              message: 'Email is available.',
            });
          } else {
            console.log('Express: Email already exists.');
            res.status(401).json({
              error: 'Unauthorized',
              details: 'Email already exists.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error,
        details: 'Database connection error.',
      });
    }
  };

  public updateloggedIn = (req: Request, res: Response) => {
    const { userId } = req.params;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `UPDATE [dbo].[users] SET lastLoggedIn = '${currentDate}' WHERE userId = ${userId}`;

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
            console.log('Express: User does not exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'User does not exist.',
            });
          } else {
            console.log(
              'Express: User last logged in field updated successfully.'
            );
            res.status(200).json({
              message: 'User last logged in field updated successfully.',
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
