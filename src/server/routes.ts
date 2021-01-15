import { Express, Router, Request, Response, NextFunction } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { IdService } from '../services/twitch';
import { TokenController } from '../controllers/TokenController';
import SubscriptionModel, {
  Subscription,
} from '../mongodb/Models/Subscription';
import MySubscriptionsModel from '../mongodb/Models/MySubscriptions';

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

  app.get('/', async (req: Request, res: Response) => {
    const subscriptions = await SubscriptionModel.find({
      streamerId: 635647858,
    });
    console.log(subscriptions);

    return res.send('to funfando mano');
  });

  app.get('/renew', (req: Request, res: Response) => {
    return new TokenController(new IdService()).handle(req, res);
  });

  app.post('/webhook', async (req, res) => {
    /* CONFIRM ACTION FOR TWITCH */
    if (req.body.challenge) {
      const { id: subscriptionId } = req.body.subscription;
      res.status(200).send(req.body.challenge);

      await MySubscriptionsModel.updateOne(
        {
          platformSubscriptionId: subscriptionId,
        },
        {
          enabled: true,
        }
      );

      return;
    }

    if (req.body.event) {
      const { event, subscription } = req.body;

      if (subscription.type === TWITCH_EVENTS.STREAM_ON) {
        console.log({ event, subscription });
        const subscriptions = await SubscriptionModel.find({
          streamerId: event.broadcaster_user_id,
        });

        const message = buildStreamOnMessage(
          event.broadcaster_user_name,
          event.broadcaster_user_login
        );

        subscriptions.map((sub: Subscription) => {
          telegramBot.sendMessage(sub.chatId, message);
        });
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
