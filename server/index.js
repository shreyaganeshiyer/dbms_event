import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import queryRoutes from './routes/queries.js';

import connectionRoutes from './routes/connections.js';
import { activate_pool } from './pool.js';
import { friendlyError } from './errors.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/connections', connectionRoutes);
app.use('/api/queries', queryRoutes);

// If the .env database settings are present, connect to them on startup.
async function connectFromEnv() {
  if (!process.env.DB_HOST) return;
  try {
    await activate_pool({
      name: 'Demo MySQL Database',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log(`Connected to database "${process.env.DB_NAME}" on ${process.env.DB_HOST}`);
  } catch (err) {
    console.warn(`Could not connect to the .env database: ${friendlyError(err)}`);
  }
}

app.listen(PORT, async () => {
  console.log(`QueryLens API running on http://localhost:${PORT}`);
  await connectFromEnv();
});