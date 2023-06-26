import { testHelloWorld } from '../routes/default';

describe('testHelloWorld', () => {
  it('should return a string', () => {
    const req = {};
    const res = {
      text: '',
      send: function (input: string) {
        this.text = input;
      },
    };
    testHelloWorld(req, res);
    expect(res.text).toBe('Hello World!');
  });
});
