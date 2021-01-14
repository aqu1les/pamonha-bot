import { Express, Router, Request, Response, NextFunction } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { IdService } from '../services/twitch';
import { TokenController } from './../controllers/TokenController';

const FELIPE_ID = 1433252838;
const LUCAS_ID = 970679066;

enum TWITCH_EVENTS {
  STREAM_ON = 'stream.online',
}

export default (app: Express, telegramBot: TelegramBot): void => {
  const router = Router();

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.botInstance = telegramBot;

    return next();
  });

  app.get('/', (req: Request, res: Response) => {
    return res.send('to funfando mano');
  });

  app.get('/renew', (req: Request, res: Response) => {
    return new TokenController(new IdService()).handle(req, res);
  });

  app.post('/webhook', (req, res) => {
    console.log({
      body: req.body,
      headers: req.headers,
    });

    /* CONFIRM ACTION FOR TWITCH */
    if (req.body.challenge) {
      return res.status(200).send(req.body.challenge);
    }

    if (req.body.event) {
      const { event, subscription } = req.body;

      if (subscription.type === TWITCH_EVENTS.STREAM_ON) {
        const message = buildStreamOnMessage(
          event.broadcaster_user_name,
          event.broadcaster_user_login
        );

        telegramBot.sendMessage(FELIPE_ID, message);
        telegramBot.sendMessage(LUCAS_ID, message);
      } else {
        telegramBot.sendMessage(
          FELIPE_ID,
          '[TWITCH] Aconteceu algo não mapeado no bot, vê os logs'
        );
      }
    }

    return res.status(200).send();
  });
};

function buildStreamOnMessage(username: string, userLogin: string) {
  return `Koe, ${username} ta on \nVe lá: https://twitch.tv/${userLogin}`;
}
