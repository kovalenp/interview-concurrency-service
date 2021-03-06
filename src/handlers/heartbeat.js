const redis = require('../redis');
const logger = require('../logger');
const response = require('../response');
const { InternalServerError } = require('../errors');
const { ttl } = require('../config');
const { heartbeatSchema } = require('../validation/schema');
const validate = require('../validation');

/**
 * Handles heartbeat request for concurrent session
 *
 * @param {*} event Lambda event
 * @returns HTTP response
 */
const heartbeatHandler = async (event) => {
  logger.debug({ event }, 'Executing heartbeatHandler');

  try {
    validate(event.body, heartbeatSchema);
  } catch (error) {
    logger.info({ error }, 'Invalid request parameters passed');
    return error;
  }

  const { sessionKey, token } = JSON.parse(event.body);

  try {
    await redis.set(sessionKey, token, 'EX', ttl);

    return response(200, {
      sessionKey,
      token,
      status: 'updated',
    });
  } catch (ex) {
    logger.error({ errorMessage: ex.message }, 'Exception in heartbeatHandler');
    return new InternalServerError('Unexpected error occurred');
  }
};

module.exports = heartbeatHandler;
