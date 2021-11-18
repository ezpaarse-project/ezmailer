const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const config = require('config');
const cors = require('cors');

const logger = require('./lib/services/logger');
const boom = require('./lib/services/boom');
const controller = require('./lib/controllers');

const env = process.env.NODE_ENV || 'development';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  headers: ['Content-Type'],
  maxAge: 10 * 60,
}));

if (env === 'development') {
  app.use(morgan('dev'));
} else {
  const stream = rfs.createStream('access.log', {
    interval: config.get('logRotation'),
    path: path.resolve(process.cwd(), 'log'),
  });
  app.use(morgan('combined', { stream }));
}

app.use(boom());

app.use('/', controller);

const server = app.listen(config.get('port'));
server.setTimeout(1000 * 60 * 30);
logger.info(`Server listening on http://localhost:${config.get('port')}`);

const closeApp = async () => {
  logger.info('Closing the server');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', closeApp);
process.on('SIGTERM', closeApp);
