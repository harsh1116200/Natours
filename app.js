const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const TourRouter = require('./Routes/tourRoutes');
const UserRouter = require('./Routes/userRoutes');
const ReviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const viewRouter = require('./Routes/viewRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Global Middlewares
//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
//144 sets security Http header
app.use(helmet());

//development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//143 limits requets from an ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);
//body parser, reading data from the body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//145- data sanitization against NoSql query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xss());
//146 prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// app.use((req, res, next) => {
//     console.log('Hello from the Middleware');
//     next();
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//3) Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', ReviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
