import { Request, Response } from 'express';
import { IdService } from '../../../services/twitch';
import { Controller, HttpMethods } from './Controller';
import { SettingsModel } from '../../../mongodb/Models/Settings';
import { OAuthHelper } from '../../../helpers/OAuth';

const FELIPE_ID = 1433252838;
const LUCAS_ID = 970679066;

export class TokenController implements Controller {
  route = '/renew';
  method = HttpMethods.GET;
  constructor(private twitchService: IdService) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const oAuth = new OAuthHelper(this.twitchService, SettingsModel);
      const settings = await oAuth.updateToken();

      req.botInstance.sendMessage(
        FELIPE_ID,
        'Token da Twitch atualizado, corno'
      );
      req.botInstance.sendMessage(
        LUCAS_ID,
        'Token da Twitch atualizado, corno'
      );

      return res.json({ settings });
    } catch (error) {
      return res.status(500).json({ error: 'sei la, merda no banco' });
    }
  }
}
