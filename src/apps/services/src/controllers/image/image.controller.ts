import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IImage from '../../models/image.interface';
import { connection as conn } from '../../main';
export default class ImageController {
  public createImage = (req: Request, res: Response) => {
    let { trainingDataId, image } = req.body;
    const query =
      `INSERT INTO [dbo].[images] (trainingDataId, image)` +
      ` VALUES (${trainingDataId}, '${image}')`;

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
              message: 'Image created successfully.',
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

  public getAllImages = (req: Request, res: Response) => {
    const query = 'SELECT * FROM [dbo].[images]';
    const images: IImage[] = [];

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
              details: 'No images exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(images);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        const image: IImage = {
          imageId: columns[0].value,
          trainingDataId: columns[1].value,
          image: columns[2].value,
        };
        images.push(image);
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public getImage = (req: Request, res: Response) => {
    const { imageId } = req.params;
    let image: IImage;
    const query = `SELECT * FROM [dbo].[images] WHERE imageId = ${imageId}`;

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
              details: 'Image does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json(image);
          }
        }
      );

      request.on('row', (columns: tedious.ColumnValue[]) => {
        image = {
          imageId: columns[0].value,
          trainingDataId: columns[1].value,
          image: columns[2].value,
        };
      });

      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  public updateImage = (req: Request, res: Response) => {
    const { imageId } = req.params;
    let { trainingDataId, image } = req.body;
    const query =
      `UPDATE [dbo].[images] SET trainingDataId = '${trainingDataId}', image = '${image}'` +
      `WHERE imageId = ${imageId}`;

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
              details: 'Image does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Image updated successfully.',
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

  public deleteImage = async (req: Request, res: Response) => {
    const { imageId } = req.params;
    const query = `DELETE FROM [dbo].[images] WHERE imageId = ${imageId}`;

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
              details: 'Image does not exist.',
            });
          } else {
            console.log(rowCount);
            res.status(200).json({
              message: 'Image deleted successfully.',
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
