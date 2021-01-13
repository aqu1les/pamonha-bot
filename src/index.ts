import { makeConnection } from './mongodb';
import { WebServer } from './server';
import { Bot } from './bot/index';
require('dotenv').config();

makeConnection();
const telegramBot = new Bot();
new WebServer(telegramBot);
