import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IUser from '../../models/user.interface';
import { connection as conn } from '../../main';
export default class UserController {
  public getAllUsers = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[users]';
    const users: IUser[] = [];

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
            console.log('Express: No users exist.');
            return res.status(404).json({
              error: 'Not Found',
              details: 'No users exist.',
            });
          } else {
            console.log('Express: users retrieved successfully.');
            res.status(200).json(users);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const user: IUser = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          dateCreated: columns[4].value,
          lastLoggedIn: columns[5].value,
        };
        users.push(user);
      });

      conn.execSql(request);
    } catch (error) {
      console.log('Express: ' + error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    let user: IUser;
    const query = `SELECT * FROM [dbo].[users] WHERE userId = ${userId}`;

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
            return res.status(404).json({
              error: 'Not Found',
              details: 'User does not exist.',
            });
          } else {
            console.log('Express: user retrieved successfully.');
            res.status(200).json(user);
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

  public updateUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    const { email, password, userRole } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = `UPDATE [dbo].[users] SET email = '${email}', password = '${password}', userRole = ${userRole}, lastLoggedIn = '${currentDate}' WHERE userId = ${userId}`;
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
            console.log('Express: user updated successfully.');
            res.status(200).json({
              message: 'User updated successfully.',
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

  public deleteUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    const query = `DELETE FROM [dbo].[users] WHERE userId = ${userId}`;

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
            return res.status(404).json({
              error: 'Not Found',
              details: 'User does not exist.',
            });
          } else {
            console.log('Express: user deleted successfully.');
            res.status(200).json({
              message: 'User deleted successfully.',
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
