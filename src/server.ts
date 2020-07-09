import express from 'express';
import Routes from './routes';
import uploadConfig from './config/upload';
import 'reflect-metadata';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(Routes);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('⚙ Server started!');
});
