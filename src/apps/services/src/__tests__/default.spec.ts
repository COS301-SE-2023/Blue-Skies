import { testHelloWorld } from '../routes/default';

jest.mock('../main', () => jest.fn());

jest.mock('../main', () => {
  return {
    connection: {
      execSql: jest.fn(),
    },
  };
});

describe('testHelloWorld', () => {
  it('should return Hello World!', () => {
    const req = {};
    const res = {
      send: jest.fn(),
    };
    testHelloWorld(req, res);
    expect(res.send).toHaveBeenCalledWith('Hello World!');
  });
});
