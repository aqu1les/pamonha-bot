import BotInjection from './BotInjection';
import { Express } from 'express';
import TelegramBot from 'node-telegram-bot-api';

type IMiddleware = (app: Express, bot: TelegramBot) => void;

export const Middlewares: Array<IMiddleware> = [BotInjection];
