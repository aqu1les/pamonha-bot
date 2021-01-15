import mongoose from 'mongoose';
import { OAuthService } from '../@types/global';

export class OAuthHelper {
  constructor(
    private oauthService: OAuthService,
    private model: mongoose.Model<mongoose.Document<any>>
  ) {}

  async updateToken() {
    const newCredentials = await this.oauthService.refreshToken();
    const settings = await this.model
      .findOne({ platform: newCredentials.platform })
      .exec();

    settings.accessToken = newCredentials.accessToken;
    settings.expiresIn = newCredentials.expiresIn;
    settings.tokenType = newCredentials.tokenType;
    settings.emittedAt = new Date().valueOf();
    settings.platform = newCredentials.platform;
    await settings.save();

    const processName = this._platformTokenEnv(settings.platform);
    process.env[processName] = settings.accessToken;

    return settings;
  }

  private _platformTokenEnv(platform: string): string {
    return `${platform.toUpperCase()}_TOKEN`;
  }
}
