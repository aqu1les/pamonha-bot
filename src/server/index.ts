import express, { Express } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import routes from './routes';

export class WebServer {
  private app: Express;

  constructor(private bot: TelegramBot) {
    this.app = express();

    this.setup();
    this.loadRoutes();
  }

  public listen(): void {
    this.app.listen(3333, () => {
      console.log('listening');
    });
  }

  private setup(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private loadRoutes(): void {
    routes(this.app, this.bot);
  }
}
