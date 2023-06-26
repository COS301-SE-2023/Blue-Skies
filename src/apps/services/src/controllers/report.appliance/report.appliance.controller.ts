import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReportAppliance from '../../models/report.appliance.interface';
import { connection as conn } from '../../main';
export default class ReportApplianceController {
  public createReportAppliance = (req: Request, res: Response) => {
    const { reportId, applianceId } = req.body;
    const query =
      `INSERT INTO [dbo].[reportAppliances] (applianceId, reportId)` +
      ` VALUES ('${applianceId}', ${reportId})`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            console.log(rowCount);
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
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'No report appliances exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAppliances);
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

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAppliancesInReport = (req: Request, res: Response) => {
    const { reportId } = req.params;
    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE reportId = ${reportId}`;
    const reportAppliances: IReportAppliance[] = [];

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAppliances);
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

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getReportsWithAppliance = (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId}`;
    const reportAppliances: IReportAppliance[] = [];

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAppliances);
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

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getAppliance = (req: Request, res: Response) => {
    const { reportId, applianceId } = req.params;
    let appliance: IReportAppliance;
    const query = `SELECT * FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId} AND reportId = ${reportId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(appliance);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        appliance = {
          reportId: columns[0].value,
          applianceId: columns[1].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;
    const { newReportId } = req.body;
    const query =
      `UPDATE [dbo].[reportAppliances] SET reportId = '${newReportId}'` +
      `WHERE reportId = ${reportId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report appliance updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateApplianceId = (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const { newApplianceId } = req.body;
    const query =
      `UPDATE [dbo].[reportAppliances] SET applianceId = '${newApplianceId}'` +
      `WHERE applianceId = ${applianceId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report appliance updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const query = `DELETE FROM [dbo].[reportAppliances] WHERE reportId = ${reportId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report appliance deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteApplianceId = async (req: Request, res: Response) => {
    const { applianceId } = req.params;
    const query = `DELETE FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report appliance deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public deleteReportAppliance = async (req: Request, res: Response) => {
    const { applianceId, reportId } = req.params;
    const query = `DELETE FROM [dbo].[reportAppliances] WHERE applianceId = ${applianceId} AND reportId = ${reportId}`;

    try {
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else if (rowCount === 0) {
            return res.status(404).json({
              error: 'Not Found',
              details: 'Report appliance does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report appliance deleted successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
