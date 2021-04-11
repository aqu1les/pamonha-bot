import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import UserModel, { User, UserDocument } from '../../mongodb/Models/User';

class CusCommand implements Command {
  description = 'Use /cus pra ver quantos cus vc ja comeu';
  key = 'cus';

  constructor(private bot: TelegramBot) {}

  async handler(message: Message): Promise<void> {
    if (!message.from) return;

    const assesFvcked = await this.getAssesFvcked(
      message.from.id.toString(),
      message.from.username || message.from.first_name
    );

    if (assesFvcked.length === 0) {
      this.bot.sendMessage(
        message.chat.id,
        'você ainda não comeu o cu de ninguém'
      );
      return;
    }
    const usersFvcked = (
      await UserModel.find({ uid: { $in: assesFvcked } })
    ).reduce(
      (users: { [key: string]: string }, user: User) => ({
        ...users,
        [user.uid]: user.name,
      }),
      {}
    );

    const quantity = assesFvcked.reduce(
      (users: { [key: string]: number }, id) => ({
        ...users,
        [id]: users[id] ? users[id] + 1 : 1,
      }),
      {}
    );

    const response = Object.entries(quantity)
      .map(
        ([userId, times]) =>
          `[${usersFvcked[userId]}](tg://user?id=${userId}) ${times}x`
      )
      .join('\n');

    this.bot.sendMessage(message.chat.id, `Você comeu: ${response}`, {
      parse_mode: 'MarkdownV2',
    });
    return;
  }

  private async getAssesFvcked(uid: string, name: string): Promise<string[]> {
    const user: UserDocument =
      (await UserModel.findOne({ uid })) ||
      (await UserModel.create({ uid, name }));
    return user.cus_comidos || [];
  }
}

export default function (bot: TelegramBot) {
  return new CusCommand(bot);
}
