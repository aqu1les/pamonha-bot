import { IdService } from '../services/twitch';
import { Controller } from './Controller';
import { TokenController } from './Token.controller';
import { IndexController } from './Index.controller';
import { TwitchWebhookController } from './TwitchWebhook.controller';

/** dependecies */
const twitchIdService = new IdService();

/** controllers */
const tokenController = new TokenController(twitchIdService);
const indexController = new IndexController();
const twitchWebhookController = new TwitchWebhookController();

export const Controllers: Array<Controller> = [
  indexController,
  tokenController,
  twitchWebhookController,
];
