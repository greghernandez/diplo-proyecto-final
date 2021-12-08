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
// Sentry
var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");

// DataDog
var dd_options = {
    'response_code':true,
    'tags': ['app:diplo_pf']
}
  
var connect_datadog = require('connect-datadog')(dd_options);

var app = express();
Sentry.init({
    dsn: "https://24d3f621be6c40ac8e39f5ddfdebb8aa@o1059739.ingest.sentry.io/6096043",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());



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

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("Sentry error test!");
});

// The error handler
app.use(Sentry.Handlers.errorHandler());


module.exports = app;
