import TelegramBot from 'node-telegram-bot-api';
import { Express, Request, Response, NextFunction } from 'express';

export default (app: Express, bot: TelegramBot): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.botInstance = bot;

    return next();
  });
};
