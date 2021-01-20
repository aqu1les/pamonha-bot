import TelegramBot from 'node-telegram-bot-api';
import { Express, Request, Response, NextFunction } from 'express';
import TwitchEvents from '../../../../mongodb/Models/TwitchEvents';

const SignatureHeader = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const TypeHeader = 'Twitch-Eventsub-Message-Type'.toLowerCase();
const RetryHeader = 'Twitch-Eventsub-Message-Retry'.toLowerCase();
const MessageIDHeader = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TimestampHeader = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();

export default (app: Express, bot: TelegramBot): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.headers[SignatureHeader]) return next();

    TwitchEvents.create({
      type: req.headers[TypeHeader],
      isRetry: parseInt('' + req.headers[RetryHeader]) > 0,
      messageId: req.headers[MessageIDHeader],
      emittedAt: req.headers[TimestampHeader],
    });

    return next();
  });
};
