import * as tedious from 'tedious';
import { Request, Response } from 'express';
import IImage from '../../models/image.interface';
import { connection as conn } from '../../main';
export default class ImageController {
  public createImage = (req: Request, res: Response) => {
    try {
      let { trainingDataId, image } = req.body;
      const query =
        `INSERT INTO [dbo].[images] (trainingDataId, image)` +
        ` VALUES (${trainingDataId}, '${image}')`;
      const request = new tedious.Request(
        query,
        (err: tedious.RequestError, rowCount: number) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          } else {
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
    try {
      const query = 'SELECT * FROM [dbo].[images]';
      const images: IImage[] = [];

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
        const image: IImage = {
          imageId: columns[0].value,
          trainingDataId: columns[1].value,
          image: columns[2].value,
        };

        images.push(image);
      });

      request.on('requestCompleted', () => {
        res.status(200);
        res.json({ images: images });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve image.',
        details: 'Database connection error.',
      });
    }
  };

  public getImage = (req: Request, res: Response) => {
    const { imageId } = req.params;

    if (!Number.isInteger(Number(imageId))) {
      return res.status(400).json({
        error: 'Invalid imageId',
        details: 'imageId must be an integer.',
      });
    }

    const query = `SELECT * FROM [dbo].[images] WHERE imageId = ${imageId}`;

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
            details: 'Image does not exist.',
          });
        } else {
          console.log(rowCount);
        }
      }
    );

    request.on('row', (columns: tedious.ColumnValue[]) => {
      const image: IImage = {
        imageId: columns[0].value,
        trainingDataId: columns[1].value,
        image: columns[2].value,
      };
      res.send(image);
    });

    conn.execSql(request);
  };

  public updateImage = (req: Request, res: Response) => {
    const { imageId } = req.params;

    if (!Number.isInteger(Number(imageId))) {
      return res.status(400).json({
        error: 'Invalid imageId',
        details: 'imageId must be an integer.',
      });
    }

    let { trainingDataId, image } = req.body;
    try {
      const query =
        `UPDATE [dbo].[images] SET trainingDataId = '${trainingDataId}', image = '${image}'` +
        `WHERE imageId = ${imageId}`;
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
              details: 'Image does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );
      conn.execSql(request);
      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Image updated successfully.',
        });
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update image.',
        details: 'Database connection error.',
      });
    }
  };

  public deleteImage = async (req: Request, res: Response) => {
    const { imageId } = req.params;

    if (!Number.isInteger(Number(imageId))) {
      return res.status(400).json({
        error: 'Invalid imageId',
        details: 'imageId must be an integer.',
      });
    }

    try {
      const query = `DELETE FROM [dbo].[images] WHERE imageId = ${imageId}`;
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
              details: 'Image does not exist.',
            });
          } else {
            console.log(rowCount);
          }
        }
      );

      request.on('requestCompleted', () => {
        res.status(200).json({
          message: 'Image deleted successfully.',
        });
      });
      conn.execSql(request);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to find image to delete.',
        details: 'Database connection error.',
      });
    }
  };
}
