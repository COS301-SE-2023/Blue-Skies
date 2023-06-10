import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IUser from '../../models/user.interface';
import { connection as conn } from '../../main';
export default class UserController {
  public getAllUsers = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[users]';
      const users: IUser[] = [];

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
        const user: IUser = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          dateCreated: columns[4].value,
        };

        users.push(user);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ users: users });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve users.',
        details: 'Database connection error.',
      });
    }
  };

  public getUser = (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!Number.isInteger(Number(userId))) {
      return res.status(400).json({
        error: 'Invalid userId',
        details: 'userId must be an integer.',
      });
    }
    try {
      const query = `SELECT * FROM [dbo].[users] WHERE userId = ${userId}`;

      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err);
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

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const user: IUser = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          dateCreated: columns[4].value,
        };
        res.status(200).json({ user: user });
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve users.',
        details: 'Database connection error.',
      });
    }
  };

  public updateUser = (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!Number.isInteger(Number(userId))) {
      return res.status(400).json({
        error: 'Invalid userId',
        details: 'userId must be an integer.',
      });
    }

    const { email, password, userRole } = req.body;

    // type check email, password, userRole

    try {
      const query = `UPDATE [dbo].[users] SET email = '${email}', password = '${password}', userRole = ${userRole} WHERE userId = ${userId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err);
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
          message: 'User updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update user.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteUser = (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!Number.isInteger(Number(userId))) {
      return res.status(400).json({
        error: 'Invalid userId',
        details: 'userId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[users] WHERE userId = ${userId}`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err);
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
          message: 'User deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find user to delete.',
        details: 'Database connection error.',
      });
    }
  };
}
