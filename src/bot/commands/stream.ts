import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';

class StreamCommand implements Command {
  description = 'Inscrever para receber mensagem quando a stream for iniciada';
  key = 'stream';

  constructor(private bot: TelegramBot) {}

  handler(message: Message): void {
    this.bot.sendMessage(
      message.chat.id,
      'Ok pera lá amigao, feature ta feita ainda não '
    );
  }
}

export default function (bot: TelegramBot) {
  return new StreamCommand(bot);
}
