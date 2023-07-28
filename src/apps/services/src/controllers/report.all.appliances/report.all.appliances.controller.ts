import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IReportAllAppliance from '../../models/report.all.appliances.interface';
import { connection as conn } from '../../main';
export default class ReportAllAppliancesController {
  public getAllReportAllAppliance = (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM [dbo].[report-all-appliance]';
      const reportAllAppliances: IReportAllAppliance[] = [];

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
              details: 'No report all appliance records exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAllAppliances);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const reportAllAppliance: IReportAllAppliance = {
          applianceId: columns[0].value,
          reportId: columns[1].value,
          numberOfAppliances: columns[2].value,
          type: columns[3].value,
          powerUsage: columns[4].value
        };

        reportAllAppliances.push(reportAllAppliance);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getReportAllAppliance = (req: Request, res: Response) => {
    const { reportId } = req.params;
    const query = `SELECT * FROM [dbo].[report-all-appliance] WHERE reportId = ${reportId}`;
    const reportAllAppliances: IReportAllAppliance[] = [];

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
              details: 'Report all appliance record does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(reportAllAppliances);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const reportAllAppliance: IReportAllAppliance = {
          reportId: columns[0].value,
          applianceId: columns[1].value,
          numberOfAppliances: columns[2].value,
          type: columns[3].value,
          powerUsage: columns[4].value
        };
        reportAllAppliances.push(reportAllAppliance);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
}
