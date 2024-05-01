'use strict'

const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient();

const pexire = promisify(redisClient.pExpire).bind(resdisClient);