import express, { Express } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import routes from './routes';
import crypto from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';

const SignatureHeader = 'Twitch-Eventsub-Message-Signature'.toLowerCase();

export class WebServer {
  private app: Express;

  constructor(private bot: TelegramBot) {
    this.app = express();

    this.setup();
    this.loadRoutes();
  }

  public listen(): void {
    this.app.listen(3333, () => {
      console.log('Web Server ouvindo na porta 3333');
    });
  }

  private setup(): void {
    this.app.use(
      express.json({
        verify: (
          req: IncomingMessage,
          res: ServerResponse,
          buf: Buffer,
          encoding: string
        ) => {
          if (req.headers[SignatureHeader]) {
            const expected = req.headers[SignatureHeader];
            const id = '' + req.headers['twitch-eventsub-message-id'];
            const timestamp =
              '' + req.headers['twitch-eventsub-message-timestamp'];

            const calculated =
              'sha256=' +
              crypto
                .createHmac('sha256', String(process.env.SECRET_WEBHOOK))
                .update(id + timestamp + buf)
                .digest('hex');

            req.verified = expected === calculated;
          }
        },
      })
    );
    this.app.use(express.urlencoded({ extended: true }));
  }

  private loadRoutes(): void {
    routes(this.app, this.bot);
  }
}
