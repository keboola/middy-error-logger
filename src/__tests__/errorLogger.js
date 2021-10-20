import createError from 'http-errors';
import middy from '@middy/core';
import errorLogger from '../errorLogger';

describe('Error Handler for Middy', () => {
  test('User error', async () => {
    const handler = middy(() => {
      throw new createError.UnprocessableEntity();
    });

    handler
      .use(errorLogger({ logger: false }));

    // run the handler
    const response = await handler({}, {});
    expect(response).toEqual({
      statusCode: 422,
      body: '{"errorMessage":"Unprocessable Entity","errorCode":422,"requestId":null}',
    });
  });

  test('App error', async () => {
    const handler = middy(() => {
      throw new Error('custom error');
    });

    handler
      .use(errorLogger({ logger: false }));

    // run the handler
    try {
      await handler({}, {});
    } catch (error) {
      expect(error.message).toEqual('Internal Error');
    }
  });

  test('Custom logger function', async () => {
    const logger = jest.fn();

    const handler = middy(() => {
      throw new createError.UnprocessableEntity();
    });

    handler
      .use(errorLogger({ logger }));

    // run the handler
    await handler({}, {});
    expect(logger).toHaveBeenCalled();
  });
});
