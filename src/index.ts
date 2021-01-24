import { Message, Metadata } from 'node-telegram-bot-api';
import { makeConnection } from './mongodb';
import { WebServer } from './server';
import { Bot } from './bot/index';
import { CommandStore } from './core/Command.store';
require('dotenv').config();

makeConnection();
const telegramBot = new Bot();
new WebServer(telegramBot).listen();

const commands = CommandStore.getInstance();

commands
  .startCommands(telegramBot)
  .then((commandStore) => {
    telegramBot.updateCommands(commandStore);

    telegramBot.listen('message', (message: Message, metadata: Metadata) => {
      if (!message.text || message.text[0] !== '/') return;
      const [key] = message.text.replace(/[^\w\s]/gi, '').split(` `);

      if (commandStore[key]) {
        const command = commandStore[key];
        return command.handler(message, metadata);
      }
    });
  })
  .catch(console.log);
