import _ from 'lodash';

export default function errorLoggerMiddleware(opts) {
  const defaults = {
    // eslint-disable-next-line no-console
    logger: console.error,
  };

  const options = Object.assign({}, defaults, opts);

  return {
    onError: (handler, next) => {
      if (typeof options.logger === 'function') {
        options.logger(JSON.stringify({
          message: _.isString(handler.error) ? handler.error : _.get(handler, 'error.message', null),
          statusCode: _.get(handler, 'error.statusCode', 500),
          stack: _.get(handler, 'error.stack', null),
          event: {
            resource: _.get(handler, 'event.resource', null),
            httpMethod: _.get(handler, 'event.httpMethod', null),
            queryStringParameters: _.get(handler, 'event.queryStringParameters', null),
            body: _.get(handler, 'event.body', null),
          },
          context: {
            sourceIp: _.get(handler, 'event.requestContext.identity.sourceIp', null),
            userAgent: _.get(handler, 'event.requestContext.identity.userAgent', null),
          },
          awsRequestId: _.get(handler, 'context.awsRequestId', null),
        }));
      }


      // eslint-disable-next-line no-underscore-dangle
      if (handler.error.constructor.super_ && handler.error.constructor.super_.name === 'HttpError') {
        // eslint-disable-next-line no-param-reassign
        handler.response = {
          statusCode: _.get(handler, 'error.statusCode', 500),
          body: JSON.stringify({
            errorMessage: handler.error.message,
            errorCode: handler.error.statusCode,
            requestId: _.get(handler, 'context.awsRequestId', null),
          }),
        };
        return next();
      }

      return next(handler.error);
    },
  };
}
