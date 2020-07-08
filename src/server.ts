import express from 'express';
import Routes from './routes';
import 'reflect-metadata';

import './database';

const app = express();

app.use(express.json());
app.use(Routes);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('⚙ Server started!');
});
