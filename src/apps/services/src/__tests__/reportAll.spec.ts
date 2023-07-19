import KeyController from '../controllers/report.all/report.all.controller';
import { Request, Response } from 'express';
import * as tedious from 'tedious';
import ReportAllController from '../controllers/report.all/report.all.controller';

jest.mock('../main', () => jest.fn());

jest.mock('../main', () => {
    return {
        connection: {
            execSql: jest.fn(),
        },
    };
});
// Mock the dependencies and modules
jest.mock('tedious', () => ({
    Request: jest.fn().mockImplementation((query, callback) => {
        // Simulate a successful query with mock data
        // Simulate a successful query with mock data
        if (query.includes('WHERE reportId = 1')) {
            callback(null, 1);
        } else {
            callback(null, 0);
        }
        const rowCount = 2;

        callback(null, rowCount);
    }),
    ColumnValue: jest.fn(),
}));

describe('Test the ReportAll Controller', () => {
    let reportAllController: ReportAllController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeAll(() => {
        reportAllController = new KeyController();
    });
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReportAll', () => {
        it('should return all reportAll records', () => {
            // Call the getAllReportAll method with the mock request and response
            reportAllController.getAllReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            // Assert that the status and json methods were called with the correct values
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });

        it('should return a 500 response with an error message when an error is thrown', () => {
            // Simulate an error being thrown
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    throw new Error('Error thrown');
                }
            );

            reportAllController.getAllReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Error thrown',
            });
        });

        it('should return a 400 response with an error message when the query is unsuccessful', () => {
            // Simulate a failed query
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    callback(new Error('Query failed'));
                }
            );

            reportAllController.getAllReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Query failed',
            });
        });

        it('should return a 404 response with an error message when the query returns no rows', () => {
            // Simulate a successful query with no rows
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    const rowCount = 0;
                    callback(null, rowCount);
                }
            );

            reportAllController.getAllReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Not Found',
                details: 'No report all records exist.',
            });
        });
    })

    describe('getReportAll', () => {
        it('should return a successful response with a message when the query is successful', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            reportAllController.getReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should return a 400 response with an error message when the query is unsuccessful', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate a failed query
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    callback(new Error('Query failed'));
                }
            );

            reportAllController.getReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Query failed',
            });
        });

        it('should return a 500 response with an error message when an error is thrown', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate an error being thrown
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    throw new Error('Error thrown');
                }
            );

            reportAllController.getReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Error thrown',
            });
        });

        it('should return a 404 response with an error message when the query returns no rows', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate a successful query with no rows
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    const rowCount = 0;

                    callback(null, rowCount);
                }
            );

            reportAllController.getReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Not Found',
                details: 'Report all record does not exist.',
            });
        });
    })

    describe('getUserReportAll', () => {
        it('should return a successful response with a message when the query is successful', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            reportAllController.getUserReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should return a 400 response with an error message when the query is unsuccessful', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate a failed query
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    callback(new Error('Query failed'));
                }
            );

            reportAllController.getUserReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Query failed',
            });
        });

        it('should return a 500 response with an error message when an error is thrown', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate an error being thrown
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    throw new Error('Error thrown');
                }
            );

            reportAllController.getUserReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Error thrown',
            });
        });

        it('should return a 404 response with an error message when the query returns no rows', () => {
            // Mock the request body data
            mockRequest.params = {
                reportId: '1',
            };

            // Simulate a successful query with no rows
            (tedious.Request as unknown as jest.Mock).mockImplementationOnce(
                (query, callback) => {
                    const rowCount = 0;

                    callback(null, rowCount);
                }
            );

            reportAllController.getUserReportAll(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Not Found',
                details: 'Report all record does not exist.',
            });
        });
    })
});