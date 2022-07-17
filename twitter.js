const config = require('./config.js');
// secrets should in derectory inporting this module
const { TwitterApi } = require('twitter-api-v2');

module.exports = new TwitterApi({
  appKey: config.APP_KEY,
  appSecret: config.APP_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
  accessToken: config.ACCESS_TOKEN,
  accessSecret: config.ACEESS_SECRET,
});