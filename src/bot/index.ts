import TelegramBot, {
  Message,
  Metadata,
  MessageType,
} from 'node-telegram-bot-api';

export class Bot extends TelegramBot {
  constructor() {
    super(process.env.TELEGRAM_TOKEN || '', {
      polling: true,
    });
  }

  listen(
    event: MessageType,
    handler: (message: Message, metadata: Metadata) => void
  ): TelegramBot {
    return this.on(event, handler);

    // this.bot.on('message', (msg) => {
    //   const chatId = msg.chat.id;

    //   if (String(msg.text).includes('/')) {
    //     console.log(msg);
    //     console.log(msg.text);
    //   }
    // });
  }
}
