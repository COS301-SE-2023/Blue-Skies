import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReportAppliance from '../../models/report.appliance.interface';
import { connection as conn } from '../../main';
export default class ReportApplianceController {
  public createReportAppliance = (req: Request, res: Response) => {
    try {
      const { reportId, applianceId } = req.body;
      const query =
        `INSERT INTO [dbo].[reportAppliances] (applianceId, reportId)` +
        ` VALUES ('${applianceId}', ${reportId})`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            return res.status(200).json({
              message: 'Report appliance created successfully.',
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

  public getAllReportAppliances = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[reportAppliances]';
      const reportAppliances: IReportAppliance[] = [];

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
        const reportAppliance: IReportAppliance = {
          reportId: columns[0].value,
          applianceId: columns[1].value,
        };

        reportAppliances.push(reportAppliance);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ reportAppliances: reportAppliances });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve report appliances.',
        details: 'Database connection error.',
      });
    }
  };

  public getAppliancesInReport = (req: Request, res: Response) => {
    const { reportId } = req.params;

    if (!Number.isInteger(Number(reportId))) {
      return res.status(400).json({
        error: 'Invalid reportId',
        details: 'reportId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE reportId = ${reportId}`;
    const reportAppliances: IReportAppliance[] = [];

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
            details: 'Report appliance does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const reportAppliance: IReportAppliance = {
        reportId: columns[0].value,
        applianceId: columns[1].value,
      };

      reportAppliances.push(reportAppliance);
    });

    request.on('requestCompleted', () => {
      res.status(200);
      res.json({ reportAppliances: reportAppliances });
    });
    conn.execSql(request);
  };

  public getReportsWithAppliance = (req: Request, res: Response) => {
    const { applianceId } = req.params;

    if (!Number.isInteger(Number(applianceId))) {
      return res.status(400).json({
        error: 'Invalid applianceId',
        details: 'applianceId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId}`;
    const reportAppliances: IReportAppliance[] = [];

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
            details: 'Report appliance does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const reportAppliance: IReportAppliance = {
        reportId: columns[0].value,
        applianceId: columns[1].value,
      };

      reportAppliances.push(reportAppliance);
    });

    request.on('requestCompleted', () => {
      res.status(200);
      res.json({ reportAppliances: reportAppliances });
    });
    conn.execSql(request);
  };

  public getAppliance = (req: Request, res: Response) => {
    const { reportId, applianceId } = req.params;

    if (!Number.isInteger(Number(applianceId))) {
      return res.status(400).json({
        error: 'Invalid applianceId or reportId',
        details: 'ApplianceId and reportId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId} AND reportId = ${reportId}`;

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
            details: 'Report appliance does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const appliance: IReportAppliance = {
        reportId: columns[0].value,
        applianceId: columns[1].value,
      };
      res.send(appliance);
    });

    conn.execSql(request);
  };

  public updateReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;

    if (!Number.isInteger(Number(reportId))) {
      return res.status(400).json({
        error: 'Invalid reportId',
        details: 'reportId must be an integer.',
      });
    }

    const { newReportId } = req.body;
    try {
      const query =
        `UPDATE [dbo].[reportAppliances] SET reportId = '${newReportId}'` +
        `WHERE reportId = ${reportId}`;
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
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );
      conn.execSql(request);
      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Report appliance updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update report appliance.',
        details: 'Database connection error.',
      });
    }
  };

  public updateApplianceId = (req: Request, res: Response) => {
    const { applianceId } = req.params;

    if (!Number.isInteger(Number(applianceId))) {
      return res.status(400).json({
        error: 'Invalid applianceId',
        details: 'applianceId must be an integer.',
      });
    }

    const { newApplianceId } = req.body;
    try {
      const query =
        `UPDATE [dbo].[reportAppliances] SET applianceId = '${newApplianceId}'` +
        `WHERE applianceId = ${applianceId}`;
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
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );
      conn.execSql(request);
      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Report appliance updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update report appliance.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    if (!Number.isInteger(Number(reportId))) {
      return res.status(400).json({
        error: 'Invalid reportId',
        details: 'reportId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[reportAppliances] WHERE reportId = ${reportId}`;
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
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Report appliance deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find report appliance to delete.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteApplianceId = async (req: Request, res: Response) => {
    const { applianceId } = req.params;

    if (!Number.isInteger(Number(applianceId))) {
      return res.status(400).json({
        error: 'Invalid applianceId',
        details: 'applianceId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId}`;
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
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Report appliance deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find report appliance to delete.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteReportAppliance = async (req: Request, res: Response) => {
    const { applianceId, reportId } = req.params;

    if (!Number.isInteger(Number(applianceId))) {
      return res.status(400).json({
        error: 'Invalid applianceId or reportId',
        details: 'applianceId and reportId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId} AND reportId = ${reportId}`;
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
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Report appliance deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find report appliance to delete.',
        details: 'Database connection error.',
      });
    }
  };
}