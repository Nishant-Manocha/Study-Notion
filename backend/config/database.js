const mongoose = require('mongoose');
const clgDev = require('../utils/clgDev');
const dotenv = require('dotenv');
require('colors');

dotenv.config({ path: './config.env' });

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then((connection) => {
        connectionPromise = undefined;
        clgDev('MongoDB connected successfully'.cyan.underline.bold);
        return connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        clgDev(`${error.message}`.red.underline.bold);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
