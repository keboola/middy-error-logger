/* eslint-disable no-console,no-underscore-dangle,no-param-reassign */
import _ from 'lodash';
import { isHttpError } from 'http-errors';

export default function errorLoggerMiddleware(opts) {
  const defaults = {
    logger: console.error,
  };

  const options = { ...defaults, ...opts };

  return {
    onError: (request) => {
      if (typeof options.logger === 'function') {
        options.logger(JSON.stringify({
          message: _.isString(request.error) ? request.error : _.get(request, 'error.message', null),
          statusCode: _.get(request, 'error.statusCode', 500),
          stack: _.get(request, 'error.stack', null),
          event: {
            resource: _.get(request, 'event.resource', null),
            httpMethod: _.get(request, 'event.httpMethod', null),
            queryStringParameters: _.get(request, 'event.queryStringParameters', null),
            body: _.get(request, 'event.body', null),
          },
          context: {
            sourceIp: _.get(request, 'event.requestContext.identity.sourceIp', null),
            userAgent: _.get(request, 'event.requestContext.identity.userAgent', null),
          },
          awsRequestId: _.get(request, 'context.awsRequestId', null),
        }));
      }

      if (isHttpError(request.error)) {
        request.response = {
          statusCode: _.get(request, 'error.statusCode', 500),
          body: JSON.stringify({
            errorMessage: request.error.message,
            errorCode: request.error.statusCode,
            requestId: _.get(request, 'context.awsRequestId', null),
          }),
        };
      } else {
        request.error.message = 'Internal Error';
      }
    },
  };
}
