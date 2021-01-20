import BotInjection from './BotInjection';
import { Express } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import VerifySignature from './twitch/VerifySignature';
import EventLogger from './twitch/EventLogger';

type IMiddleware = (app: Express, bot: TelegramBot) => void;

export const Middlewares: Array<IMiddleware> = [
  VerifySignature,
  BotInjection,
  EventLogger,
];
