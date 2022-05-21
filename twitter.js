require('dotenv').config();
// secrets should in derectory inporting this module
const { TwitterApi } = require('twitter-api-v2');

module.exports = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACEESS_SECRET,
});