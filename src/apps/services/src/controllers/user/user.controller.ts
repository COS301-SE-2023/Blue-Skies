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
    const query = `SELECT * FROM [dbo].[users] WHERE userId = ${userId}`;

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

      res.send(user);
    });

    conn.execSql(request);
  };

  public updateUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    const { email, password, userRole } = req.body;
    const query = `UPDATE [dbo].[users] SET email = '${email}', password = '${password}', userRole = '${userRole}' WHERE userId = ${userId}`;

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
    request.on('requestCompleted', () => {
      res.status(200);
    });
    conn.execSql(request);
  };

  deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const query = `DELETE FROM [dbo].[users] WHERE userId = ${userId}`;
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
    request.on('requestCompleted', () => {
      res.status(200);
    });
    conn.execSql(request);
  };
}
