#!/bin/bash
source ~/.nvm/nvm.sh
nvm use v16.13.1
cp server-logger.log server-logger-prev.log
node server-logger.js | ts '[%Y-%m-%d %H:%M:%.S]' > server-logger.log
