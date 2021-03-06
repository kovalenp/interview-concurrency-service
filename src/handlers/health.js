const log = require('../logger');

/**
 * Service health check request
 *
 * @param {*} event Lambda event
 * @returns HTTP response
 */
const healthHandler = (event) => {
  log.trace({ event }, 'Executed health check');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      healthy: true,
    }),
  };
};

module.exports = healthHandler;
