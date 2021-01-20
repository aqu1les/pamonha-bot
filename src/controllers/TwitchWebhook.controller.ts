import { Request, Response } from 'express';
import { Controller, HttpMethods } from './Controller';
import MySubscriptionsModel from '../mongodb/Models/MySubscriptions';
import SubscriptionModel, {
  Subscription,
} from '../mongodb/Models/Subscription';
import TelegramBot from 'node-telegram-bot-api';
import NotificationLog from '../mongodb/Models/NotificationLog';
import { TWITCH_EVENTS } from '../@types/twitch';

const FELIPE_ID = '1433252838';
const LUCAS_ID = '970679066';

export class TwitchWebhookController implements Controller {
  route = '/webhook';
  method = HttpMethods.POST;
  private telegramBot: TelegramBot | undefined;

  async handle(req: Request, res: Response): Promise<Response> {
    this.telegramBot = req.botInstance;

    /* CONFIRM ACTION FOR TWITCH */
    if (req.body.challenge) {
      const { id: subscriptionId } = req.body.subscription;
      await this.enableSubscription(subscriptionId);

      return res.status(200).send(req.body.challenge);
    }

    if (req.body.event) {
      const { event, subscription } = req.body;

      switch (subscription.type) {
        case TWITCH_EVENTS.STREAM_ON: {
          const subscriptions = await SubscriptionModel.find({
            streamerId: event.broadcaster_user_id,
          });

          const message = this.buildStreamOnMessage(
            event.broadcaster_user_name,
            event.broadcaster_user_login
          );

          subscriptions.map((sub: Subscription) => {
            this.notifyStakeholder(sub, message);
          });

          return res.status(200).send();
        }
        default: {
          this.fallback();
          return res.status(200).send();
        }
      }
    }

    return res.status(200).send();
  }

  private async enableSubscription(subscriptionId: string): Promise<void> {
    await MySubscriptionsModel.updateOne(
      {
        platformSubscriptionId: subscriptionId,
      },
      {
        enabled: true,
      }
    );
  }

  private fallback(): void {
    this.sendMessage(
      FELIPE_ID,
      '[TWITCH] Aconteceu algo não mapeado no bot, vê os logs'
    );
  }

  private buildStreamOnMessage(username: string, userLogin: string): string {
    return `Koe, ${username} ta on \nVe lá: https://twitch.tv/${userLogin}`;
  }

  private sendMessage(chatId: string, message: string): void {
    this.telegramBot?.sendMessage(chatId, message);
  }

  private notifyStakeholder(subscription: Subscription, message: string): void {
    this.sendMessage(subscription.chatId, message);

    NotificationLog.create({
      chatId: subscription.chatId,
      message,
    });
  }
}
