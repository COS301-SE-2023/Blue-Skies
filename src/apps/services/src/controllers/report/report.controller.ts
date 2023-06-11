import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReport from '../../models/report.interface';
import { connection as conn } from '../../main';
export default class ReportController {
  public createReport = (req: Request, res: Response) => {
    try {
      const {
        reportName,
        userId,
        basicCalculationId,
        solarScore,
        runningTime,
      } = req.body;

      const dateCreated = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      const query =
        `INSERT INTO [dbo].[reports] (reportName, userId, basicCalculationId, solarScore, runningTime, dateCreated)` +
        ` VALUES ('${reportName}', ${userId}, ${basicCalculationId}, ${solarScore}, ${runningTime}, '${dateCreated}')`;

      console.log(query);
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
            return res.status(200).json({
              message: 'Report created successfully.',
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

  public getAllReports = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[reports]';
      const reports: IReport[] = [];

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
        const report: IReport = {
          reportId: columns[0].value,
          reportName: columns[1].value,
          userId: columns[2].value,
          basicCalculationId: columns[3].value,
          solarScore: columns[4].value,
          runningTime: columns[5].value,
          dateCreated: columns[6].value,
        };

        reports.push(report);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ reports: reports });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve reports.',
        details: 'Database connection error.',
      });
    }
  };
}
