const { TwitterApi } = require('twitter-api-v2');

module.exports = new TwitterApi({
    appKey: '2yoD9AScEFJWIVI6lc6Nmg',
    appSecret: 'qf2Pi3qsHvA0RjomsnNRhY5iKDWHIVy9DQWGBzDQIkw',
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: '41890375-lzLkRN8mby5403MusMFzK8VeVbuSyd2aVoejewZdd',
    accessSecret: 'BqXUHskZRV25p9Wl7iiRl5fURu8DDFq9nIEXQ3It8jxQT',
  });