const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

winston.addColors({
  verbose: 'green', info: 'green', warn: 'yellow', error: 'red',
});

const { format } = winston;

module.exports = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new (winston.transports.Console)(),
    new winston.transports.DailyRotateFile({
      frequency: '24h',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: path.resolve(process.cwd(), 'log'),
    }),
  ],
});
