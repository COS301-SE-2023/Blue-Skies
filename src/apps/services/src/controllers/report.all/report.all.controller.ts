import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReportAll from '../../models/report.all.interface';
import { connection as conn } from '../../main';
export default class ReportAllController {
  public getAllReportAll = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[report-all]';
      const reportAlls: IReportAll[] = [];

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
              details: 'No report all records exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAlls);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const reportAll: IReportAll = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          userDateCreated: columns[4].value,
          lastLoggedIn: columns[5].value,
          reportId: columns[6].value,
          reportName: columns[7].value,
          solarScore: columns[8].value,
          runningTime: columns[9].value,
          reportDateCreated: columns[10].value,
          basicCalculationId: columns[11].value,
          daylightHours: columns[12].value,
          location: columns[13].value,
          basicCalculationDateCreated: columns[14].value,
          systemId: columns[15].value,
          systemSize: columns[16].value,
          inverterOutput: columns[17].value,
          numberOfPanels: columns[18].value,
          batterySize: columns[19].value,
          numberOfBatteries: columns[20].value,
          solarInput: columns[21].value,
          applianceId: columns[22].value,
          type: columns[23].value,
          powerUsage: columns[24].value,
        };

        reportAlls.push(reportAll);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getReportAll = (req: Request, res: Response) => {
    const { reportId } = req.params;
    const query = `SELECT * FROM [dbo].[report-all] WHERE reportId = ${reportId}`;
    const reportAlls: IReportAll[] = [];

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
              details: 'Report all record does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAlls);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const reportAll: IReportAll = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          userDateCreated: columns[4].value,
          lastLoggedIn: columns[5].value,
          reportId: columns[6].value,
          reportName: columns[7].value,
          solarScore: columns[8].value,
          runningTime: columns[9].value,
          reportDateCreated: columns[10].value,
          basicCalculationId: columns[11].value,
          daylightHours: columns[12].value,
          location: columns[13].value,
          basicCalculationDateCreated: columns[14].value,
          systemId: columns[15].value,
          systemSize: columns[16].value,
          inverterOutput: columns[17].value,
          numberOfPanels: columns[18].value,
          batterySize: columns[19].value,
          numberOfBatteries: columns[20].value,
          solarInput: columns[21].value,
          applianceId: columns[22].value,
          type: columns[23].value,
          powerUsage: columns[24].value,
        };
        reportAlls.push(reportAll);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getUserReportAll = (req: Request, res: Response) => {
    const { userId } = req.params;
    const query = `SELECT * FROM [dbo].[report-all] WHERE userId = ${userId}`;
    const reportAlls: IReportAll[] = [];

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
              details: 'Report all record does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAlls);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const reportAll: IReportAll = {
          userId: columns[0].value,
          email: columns[1].value,
          password: columns[2].value,
          userRole: columns[3].value,
          userDateCreated: columns[4].value,
          lastLoggedIn: columns[5].value,
          reportId: columns[6].value,
          reportName: columns[7].value,
          solarScore: columns[8].value,
          runningTime: columns[9].value,
          reportDateCreated: columns[10].value,
          basicCalculationId: columns[11].value,
          daylightHours: columns[12].value,
          location: columns[13].value,
          basicCalculationDateCreated: columns[14].value,
          systemId: columns[15].value,
          systemSize: columns[16].value,
          inverterOutput: columns[17].value,
          numberOfPanels: columns[18].value,
          batterySize: columns[19].value,
          numberOfBatteries: columns[20].value,
          solarInput: columns[21].value,
          applianceId: columns[22].value,
          type: columns[23].value,
          powerUsage: columns[24].value,
        };
        reportAlls.push(reportAll);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
