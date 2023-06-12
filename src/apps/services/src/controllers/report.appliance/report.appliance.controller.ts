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
}
