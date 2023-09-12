const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()



// init middlewares
app.use(morgan('dev'))  // => development
//app.use(morgan('combined')) // => production
//app.use(morgan('common'))
//app.use(morgan('short'))
//app.use(morgan('tiny'))

app.use(helmet())
app.use(compression())

// init db

// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello world'
    return res.status(200).json({
        message: 'Welcome to Nodejs',
        metadata: strCompress.repeat(1000000)
    })
})

// handling error

module.exports = app