import { connection as conn } from '../../main';
import { Request, Response } from 'express';
import * as tedious from 'tedious';
import IUser from '../../models/user.interface';

export default class AuthController {
  public registerUser = (req: Request, res: Response) => {
    try {
      const { email, password, userRole } = req.body;
      console.log(
        '🚀 ~ file: auth.controller.ts:10 ~ AuthController ~ email:',
        email
      );
      console.log(
        '🚀 ~ file: auth.controller.ts:11 ~ AuthController ~ password:',
        password
      );
      console.log(
        '🚀 ~ file: auth.controller.ts:12 ~ AuthController ~ userRole:',
        userRole
      );

      //check if parameters are empty
      if (
        email === undefined ||
        password === undefined ||
        userRole === undefined
      ) {
        return res.status(400).json({
          error: 'Invalid parameters.',
          details: 'Email, password and user role are required.',
        });
      } else {
        console.log('🚀 Register user');
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
              return res.status(404).json({
                error: err.message,
              });
            } else {
              console.log(rowCount);
            }
          }
        );

        conn.execSql(request);

        res.status(200).json({
          message: 'User registered successfully.',
        });
      }
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
            return res.status(404).json({
              error: err.message,
            });
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

  //Check if email already exists
  public checkEmail = (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // console.log(
      //   '🚀 ~ file: auth.controller.ts:109 ~ AuthController ~ email:',
      //   email
      // );

      const query = `SELECT * FROM [dbo].[users] WHERE CONVERT(VARCHAR, email) = '${email}'`;
      let foundUser = true;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(404).json({
              error: err.message,
            });
          } else {
            if (rowCount === 0) {
              foundUser = false;
            }
            // console.log(
            //   '🚀 ~ file: auth.controller.ts:125 ~ AuthController ~ rowCount:',
            //   rowCount
            // );
          }
        }
      );

      request.on('requestCompleted', () => {
        if (foundUser) {
          res.status(200).json({
            message: 'Email is available.',
          });
        } else {
          res.status(404).json({
            error: 'Email is not available.',
            details: 'Email already exists.',
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
