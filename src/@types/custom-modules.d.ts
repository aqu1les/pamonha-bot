import TelegramBot from 'node-telegram-bot-api';

declare module 'express-serve-static-core' {
  export interface Request {
    botInstance: TelegramBot;
  }
}
