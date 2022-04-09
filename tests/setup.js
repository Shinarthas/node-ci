jest.setTimeout(30000)
const mongoose = require('mongoose');
const puppeteer=require('puppeteer')
const keys=require('../config/keys');
require('../models/User');
const User=mongoose.model('User')

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });