import { Express, Router } from 'express';
import TelegramBot from 'node-telegram-bot-api';

const FELIPE_ID = 1433252838;
const LUCAS_ID = 970679066;

export default (app: Express, telegramBot: TelegramBot): void => {
  const router = Router();

  app.use('/api', router);

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
      telegramBot.sendMessage(FELIPE_ID, 'STREAM ON');
      telegramBot.sendMessage(LUCAS_ID, 'STREAM ON');
    }

    return res.status(200).send();
  });
};
