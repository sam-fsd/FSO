require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_CLOUD_MONGODB_URI
    : process.env.CLOUD_MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
