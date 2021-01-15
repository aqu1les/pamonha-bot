import { Command } from '../../@types/global';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import ApiService from '../../services/twitch/apiService';
import { IdService } from '../../services/twitch/idService';
import { OAuthHelper } from '../../helpers/OAuth';
import { SettingsModel } from '../../mongodb/Models/Settings';
import { StreamerNotFound } from './../../exceptions/twitch';

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
    if (streamerName.length === 0) return;
    this.bot.sendMessage(message.chat.id, 'Vendo se o streamer existe...');

    try {
      const streamer = await this.apiService.getStreamer(streamerName);

      this.bot.sendPhoto(message.chat.id, streamer.profile_image_url);
      this.bot.sendMessage(message.chat.id, streamer.display_name);
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
