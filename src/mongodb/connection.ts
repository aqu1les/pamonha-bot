import mongoose from 'mongoose';

export const makeConnection = () => {
  mongoose
    .connect(
      `mongodb+srv://aqu1les:${process.env.DB_PASSWORD}@cluster0-kvfg5.mongodb.net/pamonha?retryWrites=true&w=majority`,
      {
        //@ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log('DB connection'))
    .catch((err) => console.log(err));
};
