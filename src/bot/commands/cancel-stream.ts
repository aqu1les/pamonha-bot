import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import ApiService from '../../services/twitch/apiService';
import SubscriptionsModel from '../../mongodb/Models/Subscription';

class CancelStreamCommand implements Command {
  description =
    'Use /cancel_stream <nome-do-streamer> (Apenas Twitch) para cancelar a inscrição';
  key = 'cancel_stream';

  private readonly apiService = new ApiService();
  constructor(private bot: TelegramBot) {}

  async handler(message: Message): Promise<void> {
    if (!message.text) return;

    const [_, ...args] = message.text.replace(/[^\w\s]/gi, '').split(` `);
    const streamerName = args[0];

    if (!streamerName || streamerName.length === 0) {
      this.bot.sendMessage(
        message.chat.id,
        'Digite o nome de um streamer válido'
      );
      return;
    }

    try {
      const streamer = await this.apiService.getStreamer(streamerName);

      const userSubscriptionData = {
        chatId: message.chat.id,
        platform: 'twitch',
        streamerId: streamer.id,
      };

      const userSubscription = await SubscriptionsModel.findOne(
        userSubscriptionData
      );

      if (!userSubscription) {
        this.bot.sendMessage(
          message.chat.id,
          'Você não possui a inscrição para este streamer'
        );
        return;
      }

      await SubscriptionsModel.deleteOne({ _id: userSubscription._id });
      this.bot.sendMessage(message.chat.id, 'Inscrição cancelada com sucesso');
    } catch (error) {
      this.bot.sendMessage(message.chat.id, 'Deu ruim :( A pamonha azedou');
      console.error(error);
    }
  }
}

export default function (bot: TelegramBot) {
  return new CancelStreamCommand(bot);
}
