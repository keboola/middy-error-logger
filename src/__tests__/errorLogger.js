import createError from 'http-errors';
import middy from 'middy';
import errorLogger from '../errorLogger';

describe('Error Handler for Middy', () => {
  test('User error', () => {
    const handler = middy(() => {
      throw new createError.UnprocessableEntity();
    });

    handler
      .use(errorLogger({ logger: false }));

    // run the handler
    handler({}, {}, (_, response) => {
      expect(_).toBe(null);
      expect(response).toEqual({
        statusCode: 422,
        body: '{"errorMessage":"Unprocessable Entity","errorCode":422,"requestId":null}',
      });
    });
  });

  test('App error', () => {
    const handler = middy(() => {
      throw new Error('custom error');
    });

    handler
      .use(errorLogger({ logger: false }));

    // run the handler
    handler({}, {}, (error, response) => {
      expect(response).toBe(undefined);
      expect(error.message).toEqual('Internal Error');
    });
  });

  test('Custom logger function', () => {
    const logger = jest.fn();

    const handler = middy(() => {
      throw new createError.UnprocessableEntity();
    });

    handler
      .use(errorLogger({ logger }));

    // run the handler
    handler({}, {}, () => {
      expect(logger).toHaveBeenCalled();
    });
  });
});
