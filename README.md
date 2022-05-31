## Error Logger Middleware for Middy

[![Build Status](https://travis-ci.org/keboola/middy-error-logger.svg?branch=master)](https://travis-ci.org/keboola/middy-error-logger)

Errors logging middleware for [Middy](https://middy.js.org/).

The middleware catches thrown exceptions and rejected promises and logs them comprehensibly to the console. All logs are enriched with event and context.

It works with `http-errors` module and creates a proper HTTP response for them using the message and the status code.

### Usage

```javascript
import createError from 'http-errors';
import middy from 'middy';
import errorLogger from '@keboola/middy-error-logger';

export const handler = middy(() => {
  throw new createError.UnprocessableEntity();
});

handler
  .use(errorLogger());
```

This sample code writes such a stringified json to the console:

```json
{
  "message": "Unprocessable Entity",
  "statusCode": 422,
  "stack": [
    "UnprocessableEntityError: Unprocessable Entity",
    "at Function._callee$ (/var/task/src/lambda.js:6:19)",
    "at tryCatch (/var/task/node_modules/regenerator-runtime/runtime.js:62:40)",
    "..."
  ],
  "event": {
    "resource": "/",
    "httpMethod": "GET",
    "queryStringParameters": null,
    "body": null
  },
  "context": {
    "sourceIp": "214.178.123.91",
    "userAgent": "Paw/3.1.7 (Macintosh; OS X/10.14.0) GCDHTTPRequest"
  },
  "awsRequestId": "ab022f5a-d3ad-11e8-89f6-89a425b4ca0a"
}
```

And return this message to the request response:

```json
{
  "errorMessage": "Unprocessable Entity",
  "errorCode": 422,
  "requestId": "ab022f5a-d3ad-11e8-89f6-89a425b4ca0a"
}
```

If the error is not an instance from `http-errors`, the error message in the response is replaced with "Internal Error." and the status code is set to 500.

## License

MIT licensed, see [LICENSE](./LICENSE) file.
