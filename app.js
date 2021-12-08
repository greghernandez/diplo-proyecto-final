var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var operationsRouter = require('./routes/operations');
var paymentRouter = require('./routes/payment');
var shipmentRouter = require('./routes/shipment');
var tasksRouter = require('./routes/tasks');

// DataDog
var dd_options = {
    'response_code':true,
    'tags': ['app:diplo_pf']
}
  
var connect_datadog = require('connect-datadog')(dd_options);

var app = express();


// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// DataDog middleware
app.use(connect_datadog);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/operations', operationsRouter)
app.use('/payment', paymentRouter);
app.use('/shipments', shipmentRouter);
app.use('/tasks', tasksRouter);


module.exports = app;
