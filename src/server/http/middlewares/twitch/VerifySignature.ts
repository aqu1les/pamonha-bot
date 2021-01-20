import TelegramBot from 'node-telegram-bot-api';
import { Express, Request, Response, NextFunction } from 'express';

const SignatureHeader = 'Twitch-Eventsub-Message-Signature'.toLowerCase();

export default (app: Express, bot: TelegramBot): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.headers[SignatureHeader]) return next();

    if (!req.verified) {
      return res.status(403).send();
    }

    return next();
  });
};
