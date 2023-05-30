// tiny wrapper with default env vars
// port before change was 3000
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
};
