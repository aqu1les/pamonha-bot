import { Request, Response } from 'express';
import { IdService } from '../services/twitch';
import { Controller } from './Controller';
import { SettingsModel } from './../mongodb/Models/Settings';

const FELIPE_ID = 1433252838;
const LUCAS_ID = 970679066;

export class TokenController implements Controller {
  constructor(private twitchService: IdService) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { data } = await this.twitchService.refreshToken();
      const settings = await SettingsModel.findOne().exec();

      settings.accessToken = data.access_token;
      settings.expiresIn = data.expires_in;
      settings.tokenType = data.token_type;
      settings.emittedAt = new Date().valueOf();
      await settings.save();

      req.botInstance.sendMessage(
        FELIPE_ID,
        'Token da Twitch atualizado, corno'
      );
      req.botInstance.sendMessage(
        LUCAS_ID,
        'Token da Twitch atualizado, corno'
      );

      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'sei la, merda no banco' });
    }
  }
}
