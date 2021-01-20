import { Express, Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

import { Middlewares } from './http/middlewares';
import { Controllers } from './http/controllers';

export default (app: Express, telegramBot: TelegramBot): void => {
  Middlewares.forEach((middleware) => {
    middleware(app, telegramBot);
  });

  Controllers.forEach((controller) => {
    app[controller.method](controller.route, (req: Request, res: Response) =>
      controller.handle(req, res)
    );
  });
};
