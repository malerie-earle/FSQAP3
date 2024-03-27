const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const color = require('colors');

// Create a 'logs' directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir);
  } catch (error) {
    console.error('Error creating logs directory:', error);
  }
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', { timeZone: 'UTC' });
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
    debug: 3,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    winston.format.printf(info => {
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
        case 'debug':
          colorizedMessage = color.blue(info.message);
          break;
      }
      // Add background color to the entire message
      return color.bgBlack(`${info.timestamp} ${info.level}: ${colorizedMessage}`);
    }),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: { service: 'admin-service' },
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
    new winston.transports.Console()
  ],
  exitOnError: false,
  handleExceptions: true, 
  handleRejections: true 
});
console.log(logger);

// Modify your error handling to capture stack traces
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack Trace:', err.stack);
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

// Usage:
logger.info('This is an information message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.');
logger.debug('This is a debug message.');

module.exports = 
logger ;
