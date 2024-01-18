'use strict'

const Logger = require('../loggers/discord.logs.v2');

const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET' ? req.query || req.params : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        })
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    pushToLogDiscord
}