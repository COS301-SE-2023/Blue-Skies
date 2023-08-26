import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReport from '../../models/report.interface';
import { connection as conn } from '../../main';
import puppeteer from 'puppeteer';
export default class ReportController {
  public createReport = (req: Request, res: Response) => {
    const { reportName, userId, homeSize, latitude, longitude, systemId } =
      req.body;
    console.log(reportName);
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query =
      `INSERT INTO [dbo].[reports] (reportName, userId, homeSize, latitude, longitude, systemId, dateCreated)` +
      ` VALUES ('${reportName}', ${userId}, '${homeSize}', ${latitude}, ${longitude}, ${systemId}, '${dateCreated}')`;

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
              message: 'Report created successfully.',
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

  public getAllReports = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[reports]';
    const reports: IReport[] = [];

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
              details: 'No reports exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reports);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const report: IReport = {
          reportId: columns[0].value,
          reportName: columns[1].value,
          userId: columns[2].value,
          homeSize: columns[3].value,
          systemId: columns[4].value,
          latitude: columns[5].value,
          longitude: columns[6].value,
          dateCreated: columns[7].value,
        };

        reports.push(report);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getUserReports = (req: Request, res: Response) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM [dbo].[reports] WHERE userId = ' + userId;
    const reports: IReport[] = [];

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
              details: 'No reports exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reports);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const report: IReport = {
          reportId: columns[0].value,
          reportName: columns[1].value,
          userId: columns[2].value,
          homeSize: columns[3].value,
          systemId: columns[4].value,
          latitude: columns[5].value,
          longitude: columns[6].value,
          dateCreated: columns[7].value,
        };

        reports.push(report);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getReport = (req: Request, res: Response) => {
    const { reportId } = req.params;
    let report: IReport;
    const query = `SELECT * FROM [dbo].[reports] WHERE reportId = ${reportId}`;

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
              details: 'Report does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(report);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        report = {
          reportId: columns[0].value,
          reportName: columns[1].value,
          userId: columns[2].value,
          homeSize: columns[3].value,
          systemId: columns[4].value,
          latitude: columns[5].value,
          longitude: columns[6].value,
          dateCreated: columns[7].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateReport = (req: Request, res: Response) => {
    const { reportId } = req.params;
    const { reportName, userId, homeSize, latitude, longitude, systemId } =
      req.body;

    const query =
      `UPDATE [dbo].[reports] SET reportName = '${reportName}', userId = ${userId}, homeSize = '${homeSize}', latitude = ${latitude}, longitude = ${longitude}, systemId = ${systemId}` +
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
              details: 'Report does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report updated successfully.',
            });
          }
        }
      );

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update report.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteReport = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const query = `DELETE FROM [dbo].[reports] WHERE reportId = ${reportId}`;

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
              details: 'Report does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Report deleted successfully.',
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

  public downloadReport = async (req: Request, res: Response) => {
    const { userId, reportId } = req.params;
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const frontend_port = process.env.FRONTEND_PORT;
    await page.goto(`${frontend_port}/report/${userId}/${reportId}`, {
      waitUntil: 'networkidle2',
    });
    // Generate a PDF from the page content
    const pdf = await page.pdf({
      format: 'A4',
      displayHeaderFooter: false,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  };
}
