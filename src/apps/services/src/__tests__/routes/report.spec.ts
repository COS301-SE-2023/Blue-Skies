import express from 'express'; // import express
import request from 'supertest'; // import supertest
import { Request, Response } from 'express';
import { reportRouter } from '../../routes/report/report.router';

const app = express(); // an instance of an express app, a 'fake' express app
app.use('/report', reportRouter); // routes
//mock the main file
jest.mock('../../main', () => jest.fn());

//mock the controller
jest.mock('../../controllers/report/report.controller', () => {
    return jest.fn().mockImplementation(() => {
        return {
        createReport: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Report is created.',
            });
            }),
        getAllReports: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'All reports are retrieved.',
            });
            }),
        getReport: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Report is retrieved.',
            });
            }),
        updateReport: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Report is updated.',
            });
            }),
        deleteReport: jest
            .fn()
            .mockImplementation((req: Request, res: Response) => {
            res.status(200).json({
                message: 'Report is deleted.',
            });
            }),
        };
    });
});

describe('Test the report path', () => {
    it('It should response the GET method', async () => {
        const response = await request(app).get('/report');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        message: 'Welcome to the report router!',
        });
    });
    it('It should response the POST method', async () => {
        // /report/all
        // /report/1
        // /report/update/36345
        const response = await request(app).post('/report/create');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        message: 'Report is created.',
        });
    });
    it('It should response the GET method', async () => {
        const response = await request(app).get('/report/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        message: 'Report is retrieved.',
        });
    });
    
});

