import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import SubscriptionsModel, {
  Subscription,
} from '../../mongodb/Models/Subscription';
import StreamersModel, { Streamer } from '../../mongodb/Models/Streamers';

class SubscriptionsCommand implements Command {
  description = 'Listar suas inscrições';
  key = 'subscriptions';

  constructor(private bot: TelegramBot) {}

  async handler(message: Message): Promise<void> {
    const subscriptions: Array<Subscription> = await SubscriptionsModel.find({
      chatId: message.chat.id,
    });
    const streamers: Array<string> = (
      await StreamersModel.find({
        streamerId: { $in: subscriptions.map((sub) => sub.streamerId) },
      })
    ).map((streamer: Streamer) => streamer.displayName);

    if (streamers.length === 0) {
      this.bot.sendMessage(
        message.chat.id,
        'tu n se inscreveu em ngm ainda porra, usa o comando /stream ai caraio'
      );

      return;
    }

    const response = 'Tu se inscreveu nos streamers: ' + streamers.join(', ');

    this.bot.sendMessage(message.chat.id, response);
  }
}

export default function (bot: TelegramBot) {
  return new SubscriptionsCommand(bot);
}
