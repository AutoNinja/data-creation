var express = require('express')
var app = express()
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')


var PORT = process.env.port || 3000;
var NODE_ENV = 'development';


// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


// middleware setup
app.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/enrollment', require('./routes/enrollment'))
app.use('/event', require('./routes/event'))

app.use('/auto/enrollment', require('./routes/enrollment_auto'))
app.use('/db', require('./routes/db'))

// throw error if page not found
app.use((req, res, next) => {
	res.render('404')
})

// handle errors
app.use((err, req, res, next) => {
	console.error(err)
	res.status(500).send(err)
})

app.listen(process.env.PORT, () => {
	console.log('Magic Happens on Port ' + PORT)
})
