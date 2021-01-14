import TelegramBot, { Message, Metadata } from 'node-telegram-bot-api';

export interface Command {
  handler: (message: Message, metadata?: Metadata) => void;
  description: string;
  key: string;
}

export type CommandFactory = (bot: TelegramBot) => Command;

export type CommandStore = {
  [key: string]: Command;
};
