import path from 'path';
import { CommandStore as Store, Command } from '../@types/global';
import fs from 'fs-extra';
import TelegramBot from 'node-telegram-bot-api';

const COMMANDS_PATH = path.resolve(__dirname, '../bot/commands');

export class CommandStore {
  private static instance: CommandStore;
  private _store: Store = {};

  private constructor() {}

  public static getInstance(): CommandStore {
    if (!CommandStore.instance) {
      CommandStore.instance = new CommandStore();
    }

    return CommandStore.instance;
  }

  get commands(): Store {
    return this._store;
  }

  public async startCommands(bot: TelegramBot): Promise<Store> {
    if (Object.keys(this.commands).length !== 0) return this.commands;

    const commandsFiles = fs.readdirSync(COMMANDS_PATH);

    await (async () => {
      for (const commandFile of commandsFiles.values()) {
        const allowedExtensions = ['js', 'ts'];
        const fileExtension = commandFile.split('.').slice(-1)[0];

        if (!allowedExtensions.includes(fileExtension)) continue;

        const command: Command = (
          await import(`${COMMANDS_PATH}/${commandFile}`)
        ).default(bot);

        this._appendCommand(command);
      }
    })();

    return this.commands;
  }

  private _appendCommand(command: Command): void {
    this._store[command.key] = command;
  }
}
