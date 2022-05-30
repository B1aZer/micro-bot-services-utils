#!/bin/bash
source ~/.nvm/nvm.sh
nvm use v16.13.1
node server-logger.js | ts '[%Y-%m-%d %H:%M:%.S]' > server-logger.log
