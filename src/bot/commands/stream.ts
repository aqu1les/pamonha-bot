import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import ApiService from '../../services/twitch/apiService';
import { IdService } from '../../services/twitch/idService';
import { OAuthHelper } from '../../helpers/OAuth';
import { SettingsModel } from '../../mongodb/Models/Settings';
import { StreamerNotFound } from '../../exceptions/twitch';
import MySubscriptionsModel from '../../mongodb/Models/MySubscriptions';
import SubscriptionsModel from '../../mongodb/Models/Subscription';

class StreamCommand implements Command {
  description = 'Use /stream <nome-do-streamer> (Apenas Twitch)';
  key = 'stream';
  readonly apiService = new ApiService();
  readonly twitchIdService = new IdService();
  readonly oAuthHelper = new OAuthHelper(this.twitchIdService, SettingsModel);

  constructor(private bot: TelegramBot) {}

  async handler(message: Message): Promise<void> {
    if (!message.text) return;

    const [_, ...args] = message.text.replace(/[^\w\s]/gi, '').split(` `);
    const streamerName = args[0];
    if (!streamerName || streamerName.length === 0) {
      this.bot.sendMessage(
        message.chat.id,
        'Digite o comando junto com o nome do streamer'
      );
      return;
    }
    this.bot.sendMessage(message.chat.id, 'Vendo se o streamer existe...');

    try {
      const streamer = await this.apiService.getStreamer(streamerName);

      const mySubscriptionExists = await MySubscriptionsModel.findOne({
        streamerId: streamer.id,
        enabled: true,
      });

      if (!mySubscriptionExists) {
        const subscription = await this.apiService.subscribeWebhook(
          streamer.id
        );
        await MySubscriptionsModel.create({
          streamerId: streamer.id,
          platform: 'twitch',
          type: subscription.type,
          platformSubscriptionId: subscription.id,
        });
      }

      const userSubscriptionData = {
        chatId: message.chat.id,
        platform: 'twitch',
        streamerId: streamer.id,
      };

      const userSubscription = await SubscriptionsModel.findOne(
        userSubscriptionData
      );

      if (userSubscription) {
        this.bot.sendMessage(
          message.chat.id,
          `Você já possui uma inscrição para esse streamer`
        );

        return;
      }

      await SubscriptionsModel.create(userSubscriptionData);

      this.bot.sendMessage(
        message.chat.id,
        `Inscrição criada, te avisaremos quando ${streamer.display_name} ficar online o/`
      );

      return;
    } catch (error) {
      if (error instanceof StreamerNotFound) {
        this.bot.sendMessage(
          message.chat.id,
          'Não foi possível encontrar o streamer solicitado'
        );

        return;
      }

      if (error.response?.status === 401) {
        this.refreshToken();

        this.bot.sendMessage(
          message.chat.id,
          'Algo de errado aconteceu, tente novamente'
        );

        return;
      }
    }
  }

  private refreshToken() {
    return this.oAuthHelper.updateToken();
  }
}

export default function (bot: TelegramBot) {
  return new StreamCommand(bot);
}
