import express from 'express';
import request from 'supertest';    
import { Request, Response } from 'express';
import { imageRouter } from '../../routes/image/image.router';

const app = express();
app.use('/image', imageRouter);

//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/image/image.controller', () => {
    return jest.fn().mockImplementation(() => {
        return {
        createImage: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Image is created.',
            });
            }),
    
        getAllImages: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'All images are retrieved.',
            });
            }),
        getImage: jest.fn().mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
            message: 'Image is retrieved.',
            });
        }),
        updateImage: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Image is updated.',
            });
            }),
        deleteImage: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Image is deleted.',
            });
            }),
        };
    });
});

describe('Test the image path', () => {
    it('It should response the GET method', async () => {
        const response = await request(app).get('/image');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Welcome to the image router!',
        });
    });
    it('It should response the POST method', async () => {
        const response = await request(app).post('/image/create');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Image is created.',
        });
    });
    it('It should response the GET method', async () => {
        const response = await request(app).get('/image/all');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'All images are retrieved.',
        });
    });
    it('It should response the GET method', async () => {
        const response = await request(app).get('/image/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Image is retrieved.',
        });
    });
   
});