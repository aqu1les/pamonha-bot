import mongoose from 'mongoose';
import { SettingsModel } from './Models/Settings';

export const makeConnection = () => {
  mongoose
    .connect(
      `mongodb+srv://aqu1les:${process.env.DB_PASSWORD}@cluster0-kvfg5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(async () => {
      console.log('DB connection');
      const settings = await SettingsModel.findOne({
        platform: 'twitch',
      }).exec();

      process.env.TWITCH_TOKEN = settings.accessToken;
    })
    .catch((err) => console.log(err));
};
