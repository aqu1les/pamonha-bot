import { CommandStore } from '../@types/global';
import TelegramBot, {
  Message,
  Metadata,
  MessageType,
} from 'node-telegram-bot-api';

type PossibleEvents = 'message' | MessageType;
export class Bot extends TelegramBot {
  constructor() {
    super(process.env.TELEGRAM_TOKEN || '', {
      polling: true,
    });
  }

  listen(
    event: PossibleEvents,
    handler: (message: Message, metadata: Metadata) => void
  ): TelegramBot {
    return this.on(event, handler);
  }

  updateCommands(store: CommandStore): void {
    const commands = Object.values(store).map((command) => ({
      command: `/${command.key}`,
      description: command.description,
    }));

    this.setMyCommands(commands)
      .then(() => console.log('Carregou commandos'))
      .catch(() => console.log('Erro ao carregar commandos'));
  }
}
