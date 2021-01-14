import { Command, CommandStore } from './@types/global';
import { Message, Metadata } from 'node-telegram-bot-api';
import { makeConnection } from './mongodb';
import { WebServer } from './server';
import { Bot } from './bot/index';
import fs from 'fs-extra';
require('dotenv').config();

makeConnection();
const telegramBot = new Bot();
new WebServer(telegramBot).listen();

const startCommands = async (): Promise<CommandStore> => {
  const handlers: CommandStore = {};
  const commandsFiles = await fs.readdir('src/bot/commands');

  await (async () => {
    for (const commandFile of commandsFiles.values()) {
      if (commandFile.split('.').slice(-1)[0] !== 'ts') return;

      const command: Command = (
        await import(`./bot/commands/${commandFile}`)
      ).default(telegramBot);

      handlers[command.key] = command;
    }
  })();

  return handlers;
};

startCommands()
  .then((commandStore) => {
    telegramBot.updateCommands(commandStore);

    telegramBot.listen('message', (message: Message, metadata: Metadata) => {
      if (!message.text || message.text[0] !== '/') return;
      const key = message.text.replace(/[^\w\s]/gi, '');

      if (commandStore[key]) {
        const command = commandStore[key];
        return command.handler(message, metadata);
      }
    });
  })
  .catch(console.log);
