// Imports
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const { combine, timestamp, printf, errors } = winston.format;
const path = require('path');
const color = require('colors');

// Import the EventEmitter class
const EventEmitter = require('events');

// Create an instance of the EventEmitter class
const myEmitter = new EventEmitter();

// Create a 'logs' directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Get current date
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Initiate daily log files inside the 'logs' directory for combined logs
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${logsDir}/%DATE%/combined-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d'
});

// Initiate daily log files inside the 'logs' directory for error logs
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${logsDir}/%DATE%/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d'
});

// Create a logger with custom format including colorization
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    printf(info => {
      let colorizedMessage = info.message;
      switch (info.level) {
        case 'info':
          colorizedMessage = color.green(info.message);
          break;
        case 'warn':
          colorizedMessage = color.magenta(info.message);
          break;
        case 'error':
          colorizedMessage = color.red(info.message);
          break;
        case 'http':
          colorizedMessage = color.rainbow(info.message);
          break;
        case 'debug':
          colorizedMessage = color.blue(info.message);
          break;
      }
      // Add background color to the entire message
      return color.bgBlack(`${info.timestamp} ${info.level}: ${colorizedMessage}`);
    }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'admin-service' },
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
    new winston.transports.Console({
      level: 'debug'
    })
  ],
  exitOnError: false,
  handleExceptions: true, 
  handleRejections: true 
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Fired when a log file is created
fileRotateTransport.on('new', (filename) => {
  logger.info(`A new log file was created: ${filename}`);
});

// Fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`A log file was rotated. Old filename: ${oldFilename}. New filename: ${newFilename}`);
});

// Fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {
  const newFilename = removedFilename.replace(logsDir, path.join(logsDir, getCurrentDate()));
  logger.info(`A log file was removed: ${newFilename}`);
});

// Listen for 'event' events
myEmitter.on('event', (url, level, message) => {
  logger[level](`Event occurred: ${message}. URL: ${url}`);
});

// Usage:
logger.info('This is an information message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.');
logger.http('This is an HTTP message.');
logger.debug('This is a debug message.');

module.exports = {
  logger,
  myEmitter
};