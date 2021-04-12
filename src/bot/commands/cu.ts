import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import UserModel, { UserDocument } from '../../mongodb/Models/User';

const MESSAGES = {
  fvcked:
    'caraio tu eh brabo mesmo, com *{{chances}}%* de chances tu comeu o cu de',
  notfvcked:
    'perguntei pro xororo e ele disse q vc tem *{{chances}}%* de chances de comer o cu de',
};

class CuCommand implements Command {
  description = 'Use /cu @<usuario> pra ver se tu consegue comer o cu dele!';
  key = 'cu';

  constructor(private bot: TelegramBot) {}

  async handler(message: Message): Promise<void> {
    if (!message.from) return;

    const mentionEntity = message.entities?.find(
      (entity) => entity.type === 'mention' || entity.type === 'text_mention'
    );

    const isBotMention = mentionEntity && !mentionEntity.user;

    if (isBotMention) {
      this.bot.sendMessage(
        message.chat.id,
        'tu n pode me comer nao porra sai daqui'
      );

      return;
    }

    if (!mentionEntity || !mentionEntity.user) {
      this.bot.sendMessage(
        message.chat.id,
        'o xororo disse q tu precisa marcar alguem'
      );

      return;
    }

    const chances = Math.round(Math.random() * 100);
    const suffix = `[${mentionEntity.user.first_name}](tg://user?id=${mentionEntity.user.id})`;
    const prefix = (chances === 100
      ? MESSAGES.fvcked
      : MESSAGES.notfvcked
    ).replace('{{chances}}', chances.toString());

    this.bot.sendMessage(message.chat.id, `${prefix} ${suffix}`, {
      parse_mode: 'MarkdownV2',
    });

    if (chances === 100) {
      const { id, username, first_name, last_name } = message.from;
      await this.incrementAssFvcked(
        id.toString(),
        username || first_name + last_name,
        mentionEntity.user
      );
    }
  }

  private async incrementAssFvcked(
    uid: string,
    name: string,
    userTarget: TelegramBot.User
  ): Promise<void> {
    const user: UserDocument =
      (await UserModel.findOne({ uid })) ||
      (await UserModel.create({ uid, name }));

    user.cus_comidos = user.cus_comidos || [];
    user.cus_comidos = [...user.cus_comidos, userTarget.id.toString()];
    await user.save();

    (await UserModel.findOne({ uid: userTarget.id.toString() })) ||
      (await UserModel.create({
        uid: userTarget.id.toString(),
        name:
          userTarget.username || userTarget.first_name + userTarget.last_name,
      }));
  }
}

export default function (bot: TelegramBot) {
  return new CuCommand(bot);
}
