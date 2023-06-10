import { connection as conn } from '../../main';
import { Request, Response } from 'express';
import * as tedious from 'tedious';
import IUser from '../../models/user.interface';

export default class AuthController {
  public registerUser = (req: Request, res: Response) => {
    try {
      const { email, password, userRole } = req.body;

      //Create datacreated variable with timestamp
      const dateCreated = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      const query = `INSERT INTO [dbo].[users] (email, password, userRole, dateCreated) VALUES ('${email}', '${password}', '${userRole}', '${dateCreated}')`;

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

      conn.execSql(request);

      res.status(200).json({
        message: 'User registered successfully.',
      });
    } catch (error) {
      res.status(500).json({
        error: error,
        details: 'Email already exists.',
      });
    }
  };

  public loginUser = (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const query = `SELECT * FROM [dbo].[users] WHERE CONVERT(VARCHAR, email) = '${email}'`;
      let foundUser = true;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            console.log(err);
          } else {
            if (rowCount === 0) {
              foundUser = false;
            }
          }
        }
      );
      let user: IUser;
      request.on('row', (columns: tedious.ColumnValue[]) => {
        user = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          dateCreated: columns[4].value,
        };
      });

      request.on('requestCompleted', () => {
        if (!foundUser) {
          res.status(404).json({
            error: 'Invalid email or password.',
            details: 'User does not exist.',
          });
        } else if (user.password === password) {
          res.status(200).json({
            message: 'User logged in successfully.',
            user: user,
          });
        } else {
          res.status(401).json({
            error: 'Invalid email or password.',
            details: 'Email or password is incorrect.',
          });
        }
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error,
        details: 'Database connection error.',
      });
    }
  };
}
