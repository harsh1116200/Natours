const dotenv = require('dotenv');
const mongoose = require('mongoose');
//123
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION !! SHUTTNG DOWN ...');
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful !'));

console.log(app.get('env'));
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}..`);
});

// 122

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTON !! SHUTTNG DOWN ....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
